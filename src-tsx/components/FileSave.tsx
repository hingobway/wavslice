import {
  useFullReset,
  useInputFileObjects,
  useMarkersList,
} from '@/ctx/fileDrop';
import { writeAudioFile } from '@/rpc/commands';
import { useLoading } from '@/utils/transition';
import { Transition } from '@headlessui/react';
import { join as pathJoin } from '@tauri-apps/api/path';
import { message, save } from '@tauri-apps/plugin-dialog';
import clsx from 'clsx';
import { LoaderCircleIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

const ALERT_DISMISSAL_MS = 8000;

export default function FileSave() {
  const files = useInputFileObjects();
  const markers = useMarkersList();
  const reset = useFullReset();

  const [status, setStatus] = useState<'SUCCESS' | 'ERROR' | null>(null);
  useEffect(() => {
    let tm: ReturnType<typeof setTimeout>;
    if (status?.length)
      tm = setTimeout(() => setStatus(null), ALERT_DISMISSAL_MS);
    return () => clearTimeout(tm);
  }, [status]);

  const [isLoading, loading] = useLoading();

  // handle save
  const submit = useCallback(() => {
    loading(async () => {
      if (!files.audio) return;

      // prompt output path
      const outputFile = await save({
        title: 'Save output audio file:',
        defaultPath: await pathJoin(
          files.audio.folder,
          `${files.audio.nameNoExt} sliced.${files.audio.ext}`,
        ),
        filters: [
          {
            name: 'allowed',
            extensions: ['wav'],
          },
        ],
      });
      if (!outputFile) return;

      if (outputFile == files.audio.path)
        return message('Your output file can’t overwrite the input file.', {
          title: 'Choose a new location',
          kind: 'error',
        });

      const success = await writeAudioFile(
        files.audio.path,
        outputFile,
        markers,
      );

      setStatus(success ? 'SUCCESS' : 'ERROR');
      if (success) reset();
    });
  }, [files.audio, loading, markers, reset]);

  return (
    <>
      <div className="flex flex-row items-end gap-4">
        {/* message area */}
        <div className="flex-1 self-stretch text-xs text-zinc-400">
          <p className="px-3">
            {/* default text */}
            {!status && (
              <span className="">
                You can also drag files into this window, or select both files
                at the same time.
              </span>
            )}

            {/* error message */}
            {status === 'ERROR' && (
              <span className="text-red-600">An error occurred.</span>
            )}

            {/* success message */}
            {status === 'SUCCESS' && (
              <span className="text-green-600">Done!</span>
            )}
          </p>
        </div>

        {/* save button */}
        <div className="mb-0.5">
          <button
            onClick={submit}
            disabled={isLoading || !files.audio}
            data-l={isLoading || null}
            data-nl={!isLoading || null}
            className={clsx(
              'group relative overflow-hidden rounded-md bg-sky-600 bg-opacity-90 px-4 py-1.5 text-sm font-bold transition-all disabled:bg-zinc-600',
              /* focus */ 'focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-sky-800',
              /* hover */ 'hover:enabled:bg-opacity-100 hover:enabled:shadow-lg',
            )}
          >
            {/* button text */}
            <span className="translate-y-0 transition group-data-[l]:translate-y-4 group-data-[l]:opacity-0">
              Save
            </span>

            {/* loader */}
            <Transition show={isLoading}>
              <div
                className={clsx(
                  'absolute inset-0 flex items-center justify-center',
                  /* transition */ 'translate-y-0 transition data-[closed]:-translate-y-4 data-[closed]:opacity-0',
                )}
              >
                <div className="animate-spin">
                  <LoaderCircleIcon className="size-4" />
                </div>
              </div>
            </Transition>
          </button>
        </div>
      </div>
    </>
  );
}
