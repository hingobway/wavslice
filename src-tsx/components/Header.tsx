import { useFullReset } from '@/ctx/fileDrop';
import { RotateCcwIcon } from 'lucide-react';

export default function Header() {
  const reset = useFullReset();

  return (
    <>
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
              className="size-6 rounded-md bg-zinc-900/70 p-1 text-zinc-300 transition hover:bg-red-700 hover:text-zinc-100"
            >
              <RotateCcwIcon className="h-full w-auto" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
