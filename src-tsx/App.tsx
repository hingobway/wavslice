import clsx from 'clsx';
import {
  useFileOnTop,
  useFullReset,
  useInputFileObjects,
  useMarkerCount,
  useMarkers,
} from './ctx/fileDrop';
import { Transition } from '@headlessui/react';
import { useOpenFileDialog } from './components/FileDropState';
import MarkerRow from './components/MarkerRow';
import { RotateCcwIcon } from 'lucide-react';
import FileSave from './components/FileSave';
import { SearchButton } from './components/SearchButton';

export default function App() {
  const [isFileOnTop] = useFileOnTop();

  const files = useInputFileObjects();
  const [markers] = useMarkers();

  const openFileDialog = useOpenFileDialog();
  const reset = useFullReset();

  const totalMarkers = useMarkerCount();

  return (
    <>
      <div className="flex min-h-dvh flex-col gap-2 p-2 pt-0">
        {/* header */}
        <header className="group flex flex-row items-center justify-between rounded-b-xl bg-zinc-800 px-4 py-1">
          <div className="flex flex-row items-center gap-4">
            <h1 className="text-lg">wavslice.</h1>
          </div>
          <div className="relative flex flex-row items-center justify-end">
            <div className="text-xs font-bold text-zinc-400">[foster]</div>

            {/* reset button */}
            <div className="absolute -inset-2 -ml-8 flex select-none flex-row items-center justify-end bg-zinc-800 pl-8 pr-1 opacity-0 transition duration-200 group-hover:opacity-100 has-[:focus]:opacity-100">
              <button
                aria-label="reset"
                onClick={reset}
                className="size-6 rounded-md bg-zinc-900/70 p-1 text-slate-300 transition hover:bg-red-600"
              >
                <RotateCcwIcon className="h-full w-auto" />
              </button>
            </div>
          </div>
        </header>

        {/* main section */}
        <main className="relative flex flex-1 flex-col gap-6 p-6 text-sm">
          {/* audio file */}
          <div className="flex flex-col gap-1">
            <div className="px-3">Choose audio file:</div>

            <div
              onClick={() => openFileDialog?.()}
              className="group flex h-7 cursor-pointer flex-row items-center truncate rounded-lg border border-zinc-400 p-2 pl-2.5 transition hover:bg-white/10"
            >
              <p className="flex-1 truncate text-zinc-300">
                {files.audio?.name}
              </p>
              <SearchButton className="group-hover:text-zinc-200" />
            </div>
          </div>

          {/* marker selector */}
          <div className="flex flex-1 flex-col gap-1">
            <div className="flex flex-row justify-between px-3">
              <div className="">Choose markers to include:</div>
              <SearchButton onClick={() => openFileDialog?.()} />
            </div>

            {/* list */}
            <div className="outsi flex flex-col divide-y divide-zinc-900/70 overflow-hidden rounded-lg border border-zinc-400 bg-zinc-800 p-px text-xs">
              <MarkerRow
                name="Original Audio File"
                markers={markers.audio.length}
                enabled={!!files.audio}
              />
              <MarkerRow
                name={files.midi?.name}
                defaultName="add a MIDI file"
                markers={markers.midi.length}
                enabled={!!files.midi}
              />
              <MarkerRow
                defaultName="add a TXT file"
                markers={markers.text.length}
                enabled={false}
              />
            </div>

            <div className="mt-2 flex flex-row justify-end px-2">
              <div className="text-right text-xs">
                <span>{totalMarkers}</span>
                <span className="text-zinc-400"> / 100 max</span>
              </div>
            </div>
          </div>

          {/* save section */}
          <div className="flex flex-row">
            <div className="flex-1 text-xs text-zinc-400">
              <p className="px-3">
                You can drag files into this window, or select both files at the
                same time.
              </p>
            </div>

            <div className="">
              <FileSave />
            </div>
          </div>

          {/* drag overlay */}
          <Transition show={isFileOnTop}>
            <div
              className={clsx(
                'absolute inset-0 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-200 bg-zinc-900/90 backdrop-blur-sm',
                /* transition */ 'transition-all duration-300 data-[closed]:opacity-0 data-[closed]:backdrop-blur-0',
              )}
            >
              <p className="text-lg">Drop audio and marker files here.</p>
            </div>
          </Transition>
        </main>
      </div>
    </>
  );
}
