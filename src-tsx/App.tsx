import { useEffect } from 'react';
import { Transition } from '@headlessui/react';

import clsx from 'clsx';
import {
  MAX_MARKERS,
  useFileOnTop,
  useInputFileObjects,
  useMarkers,
  useMarkersList,
} from './ctx/filesState';
import { isDev } from './utils/dev';
import { useOpenFileDialog } from './ctx/fileParseState';

import Header from './components/Header';
import MarkerRow from './components/MarkerRow';
import FileSave from './components/FileSave';
import SearchButton from './components/SearchButton';
import TextFormatDialog from './components/dialogs/TextFormatDialog';
import RemoteSessionDialog from './components/dialogs/RemoteSessionDialog';
import MarkerVis from './components/MarkerVis';

export default function App() {
  const [isFileOnTop] = useFileOnTop();

  const files = useInputFileObjects();
  const [markers] = useMarkers();

  const openFileDialog = useOpenFileDialog();

  const { length: totalMarkers } = useMarkersList();

  // disabled right-click in production
  useEffect(() => {
    const cb = (ev: Event) => {
      if (!isDev) ev.preventDefault();
    };
    document.addEventListener('contextmenu', cb);
    return () => document.removeEventListener('contextmenu', cb);
  }, []);

  // ROUTING

  if (location.pathname === TextFormatDialog.path) return <TextFormatDialog />;
  if (location.pathname === RemoteSessionDialog.path)
    return <RemoteSessionDialog />;

  // RENDER

  return (
    <>
      <div className="fixed inset-0 flex flex-col">
        {/* header */}
        <Header />

        {/* main section */}
        <main className="relative m-2 flex flex-1 flex-col gap-6 p-6 text-sm">
          {/* audio file */}
          <div className="flex flex-col gap-1">
            <div className="px-3">Choose audio file:</div>

            <div
              onClick={() => openFileDialog?.()}
              className="group flex h-7 cursor-pointer flex-row items-center truncate rounded-lg border border-zinc-400 p-2 pl-2.5 transition hover:bg-white/10"
            >
              <p className="flex-1 truncate text-zinc-300">
                {files.audio?.name}
                {!files.audio && (
                  <span className="text-zinc-600">audio.wav</span>
                )}
              </p>
              <SearchButton className="group-hover:text-zinc-200" />
            </div>
          </div>

          {/* marker selector */}
          <div className="flex flex-col gap-1">
            <div className="flex flex-row justify-between px-3">
              <div className="">Choose markers to include:</div>
              <SearchButton onClick={() => openFileDialog?.()} />
            </div>

            {/* list */}
            <div className="outsi flex flex-col divide-y divide-zinc-900/70 overflow-hidden rounded-lg border border-zinc-400 bg-zinc-800 p-px text-xs">
              <MarkerRow
                markerName="audio"
                name="Original Audio File"
                markers={markers.audio.length}
                enabled={!!files.audio}
              />
              <MarkerRow
                markerName="midi"
                name={files.midi?.name}
                defaultName="Add a MIDI file..."
                markers={markers.midi.length}
                enabled={!!files.midi}
              />
              <MarkerRow
                markerName="session"
                name={files.session?.name}
                defaultName="Add a DAW session..."
                markers={markers.session.length}
                enabled={!!files.session}
              />
              {/* <MarkerRow
                markerName="text"
                // name={files.text?.name}
                defaultName={<em>add a TXT file (coming soon)</em>}
                markers={markers.text.length}
                enabled={false}
              /> */}
            </div>

            <div className="mt-2 flex flex-row justify-end px-2">
              <div className="text-right text-xs">
                <span>{totalMarkers}</span>
                <span className="text-zinc-400"> / {MAX_MARKERS} max</span>
              </div>
            </div>
          </div>

          <MarkerVis />

          {/* divider */}
          <div className="flex-1 border-b border-zinc-800" />

          {/* save section */}
          <FileSave />

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
