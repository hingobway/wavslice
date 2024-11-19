import { useInputFileObjects, useMarkerCount } from '@/ctx/fileDrop';
import { save } from '@tauri-apps/plugin-dialog';
import { useCallback } from 'react';

export default function FileSave() {
  const files = useInputFileObjects();
  const totalMarkers = useMarkerCount();

  // handle save
  const submit = useCallback(async () => {
    const path_out = await save({
      title: 'Save output audio file',
      defaultPath: files.audio?.path,
      filters: [
        {
          name: 'allowed',
          extensions: ['wav'],
        },
      ],
    });

    console.log(path_out);
  }, [files.audio]);

  return (
    <>
      <button
        onClick={submit}
        disabled={!files.audio || !totalMarkers}
        className="rounded-full bg-sky-700 px-6 py-1 text-sm font-bold opacity-90 transition-all focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-sky-800 hover:enabled:opacity-100 hover:enabled:shadow-lg disabled:bg-zinc-600"
      >
        Save
      </button>
    </>
  );
}
