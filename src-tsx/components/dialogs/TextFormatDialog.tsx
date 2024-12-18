import {
  GlobalKeyboardHandler,
  useGlobalKeyboardShortcuts,
} from '@/utils/globalKeyboard';
import { relativeWindowPos } from '@/utils/relativePosition';
import {
  getCurrentWebviewWindow,
  WebviewWindow,
} from '@tauri-apps/api/webviewWindow';
import { useCallback } from 'react';

const PATH = '/dialog-text';

export default function TextFormatDialog() {
  // close shortcut
  const handleShortcut = useCallback<GlobalKeyboardHandler>(
    (e, { withModifiers }) => {
      if (e.key === 'Escape' && !withModifiers)
        getCurrentWebviewWindow().close();
    },
    [],
  );
  useGlobalKeyboardShortcuts(handleShortcut);

  return (
    <>
      <div
        className="fixed inset-0 flex flex-col gap-12 p-12"
        data-tauri-drag-region
      >
        <div className="space-y-1 text-center">
          <h1 className="py-2 text-xl">Identify your marker format</h1>
          <p className="text-sm text-zinc-400">
            We couldn’t determine the format of your marker file.{' '}
            <span className="text-zinc-300">
              Select the correct format below.
            </span>
          </p>
        </div>
        <div className="flex h-64 flex-row gap-4">
          <FormatButton />
          <FormatButton />
          <FormatButton />
        </div>
      </div>
    </>
  );
}

function FormatButton() {
  const close = useCallback(() => {
    getCurrentWebviewWindow().close();
  }, []);
  return (
    <>
      <button
        onClick={close}
        className="flex-1 rounded-xl bg-zinc-800 transition duration-100 hover:bg-zinc-700"
      >
        {/*  */}
        {/*  */}
      </button>
    </>
  );
}

// ------------------------------------------------------

// eslint-disable-next-line react-refresh/only-export-components
export async function createDialog() {
  const PARENT = 'main';
  const WIDTH = 888;
  const HEIGHT = 462;

  const xy = await relativeWindowPos(PARENT, {
    w: WIDTH,
    center: 'x',
    y: 32,
  });

  new WebviewWindow('popup', {
    parent: PARENT,
    url: PATH,
    title: 'Dialog: Text Format',
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

TextFormatDialog.create = createDialog;
TextFormatDialog.path = PATH;
