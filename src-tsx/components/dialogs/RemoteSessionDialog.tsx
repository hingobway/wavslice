import { ipcEmit } from '@/func/ipc';
import {
  GlobalKeyboardHandler,
  useGlobalKeyboardShortcuts,
} from '@/utils/globalKeyboard';
import { relativeWindowPos } from '@/utils/relativePosition';
import {
  getCurrentWebviewWindow,
  WebviewWindow,
} from '@tauri-apps/api/webviewWindow';
import { CloudUploadIcon, ExternalLinkIcon } from 'lucide-react';
import { useCallback } from 'react';

const PATH = '/dialog-timestamps';

export default function RemoteSessionDialog() {
  // submit
  const handleSubmit = useCallback((agreed: boolean) => {
    ipcEmit('remote_confirm')(agreed);
    getCurrentWebviewWindow().close();
  }, []);

  // shortcuts
  const handleShortcut = useCallback<GlobalKeyboardHandler>(
    (e, { withModifiers }) => {
      if (withModifiers) return;
      if (e.key === 'Escape') handleSubmit(false);
      if (e.key === 'Enter') handleSubmit(true);
    },
    [],
  );
  useGlobalKeyboardShortcuts(handleShortcut);

  return (
    <>
      <div
        data-tauri-drag-region
        className="fixed inset-0 flex flex-col gap-4 p-8 pt-12"
      >
        <div className="flex flex-1 flex-col gap-4 px-4 text-sm leading-relaxed text-zinc-400">
          <h3 className="mb-2 text-lg text-zinc-100">
            <CloudUploadIcon className="mr-2 inline size-6 text-zinc-600" />
            <span> Your session will be processed remotely.</span>
          </h3>
          <p>
            <span>DAW session files are processed using </span>
            <a
              href="https://timestamps.me"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-500 focus:outline-none [&:is(:hover,:focus)]:underline"
            >
              timestamps.me
            </a>
            <span>. </span>
            <span className="text-zinc-100">
              Your session file will be temporarily uploaded to their server.
            </span>
          </p>
          <p>
            This service is provided for free, but please consider donating to
            its maintainer if you’re able.
          </p>
        </div>

        {/* actions */}
        <div className="flex flex-row gap-2 border-t border-zinc-800 pt-6 text-center">
          <a
            href="https://www.buymeacoffee.com/offlinemark"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-yellow-600 px-4 py-1.5 text-sm font-bold text-zinc-950"
          >
            Donate <ExternalLinkIcon className="-mt-1 inline size-3" />
          </a>
          <div className="flex-1" />
          <button
            onClick={() => handleSubmit(false)}
            className="rounded-md bg-zinc-700 px-4 py-1.5 text-sm font-bold"
          >
            Cancel <kbd className="-mr-1 ml-1">Esc</kbd>
          </button>
          <button
            onClick={() => handleSubmit(true)}
            className="rounded-md bg-sky-600 px-4 py-1.5 text-sm font-bold"
          >
            Process <kbd className="-mr-1 ml-1">&#x23CE;</kbd>
          </button>
        </div>
      </div>
    </>
  );
}

// ------------------------------------------------------

export async function createDialog() {
  const WIDTH = 481;
  const HEIGHT = 321;

  const xy = await relativeWindowPos('main', {
    w: WIDTH,
    h: HEIGHT,
    center: 'xy',
  });

  new WebviewWindow('popup', {
    parent: 'main',
    url: PATH,
    title: 'Dialog: Remote Session Processing',
    width: WIDTH,
    height: HEIGHT,
    x: xy?.x,
    y: xy?.y,
    resizable: false,
    minimizable: false,
    hiddenTitle: true,
    titleBarStyle: 'overlay',
  });
}

RemoteSessionDialog.create = createDialog;
RemoteSessionDialog.path = PATH;
