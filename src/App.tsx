import clsx from 'clsx';
import {
  useFileOnTop,
  useFullReset,
  useInputFileObjects,
  useMarkers,
} from './ctx/fileDrop';
import { Transition } from '@headlessui/react';
import { useOpenFileDialog } from './components/FileDropState';
import MarkerRow from './components/MarkerRow';
import { Search as IconSearch } from 'lucide-react';

export default function App() {
  const [isFileOnTop] = useFileOnTop();

  const files = useInputFileObjects();
  const [markers] = useMarkers();

  const openFileDialog = useOpenFileDialog();
  const reset = useFullReset();

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
                onClick={reset}
                className="group-hover:enabled rounded-md border border-red-600 px-2 text-sm text-red-600 transition hover:bg-red-800/10 focus:outline focus:outline-1 focus:outline-offset-2 focus:outline-red-600"
              >
                reset
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
              <button
                aria-label="select files"
                className="flex size-5 items-center justify-center rounded-full p-px text-zinc-400 transition group-hover:text-zinc-200"
              >
                <IconSearch className="h-full w-auto" />
              </button>
            </div>
          </div>

          {/* marker selector */}
          <div className="flex flex-1 flex-col gap-1">
            <div className="flex flex-row justify-between px-3">
              <div className="">Choose markers to include:</div>
              <button
                aria-label="select files"
                onClick={() => openFileDialog?.()}
                className="flex size-5 items-center justify-center rounded-full p-px text-zinc-400 transition hover:text-zinc-200"
              >
                <IconSearch className="h-full w-auto" />
              </button>
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
                <span>23</span>
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
              <button className="rounded-full bg-sky-700 px-6 py-1 text-sm font-bold opacity-90 transition-all hover:opacity-100 hover:shadow-lg focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-sky-800">
                Save
              </button>
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
