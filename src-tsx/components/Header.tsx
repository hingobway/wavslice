import { useFullReset } from '@/ctx/fileDrop';
import clsx from 'clsx';
import { RotateCcwIcon } from 'lucide-react';

export default function Header() {
  const reset = useFullReset();

  return (
    <>
      <header
        data-tauri-drag-region
        className="group relative flex flex-row items-center justify-center bg-zinc-800 px-4 py-1"
      >
        <h1 data-tauri-drag-region className="text-sm">
          wavslice.
        </h1>

        <div
          data-tauri-drag-region
          className="absolute inset-y-0 right-3 flex flex-row items-center justify-end"
        >
          <div className="text-xs font-bold text-zinc-400">[foster]</div>

          {/* reset button */}
          <div
            data-tauri-drag-region
            className={clsx(
              'absolute inset-0 -ml-8 -mr-1.5 flex select-none flex-row items-center justify-end bg-zinc-800 pl-8',
              /* hover */ 'opacity-0 transition duration-200 group-hover:opacity-100 has-[:focus]:opacity-100',
            )}
          >
            <button
              aria-label="reset"
              onClick={reset}
              className={clsx(
                '-mr-px flex size-5 items-center justify-center rounded-md bg-zinc-900/70 p-0.5 text-zinc-300',
                /* hover/focus */ 'transition focus:outline-none [&:is(:hover,:focus)]:bg-red-700 [&:is(:hover,:focus)]:text-zinc-100',
              )}
            >
              <RotateCcwIcon className="h-full w-auto" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
