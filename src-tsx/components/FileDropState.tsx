import {
  getPathProps,
  InputFiles,
  useFileOnTop,
  useInputFiles,
  useUpdateMarkers,
} from '@/ctx/fileDrop';
import { Children } from '@/utils/reactTypes';
import { useCallback, useEffect } from 'react';

import { getCurrentWebview } from '@tauri-apps/api/webview';
import { open } from '@tauri-apps/plugin-dialog';
import { createCallbackCtx } from '@/utils/callback';

import { MimeType } from '@/utils/mimeTypes';

const { Provider: FileDialogProvider, useHook: useOpenFileDialog } =
  createCallbackCtx();
export { useOpenFileDialog };

export default function FileDropState({ children }: Children) {
  const [, setOnTop] = useFileOnTop();

  const [files, setFiles] = useInputFiles();

  const processPaths = useCallback(
    (files: string[]) => {
      const newFiles: InputFiles = {};
      for (const path of files) {
        const fp = getPathProps(path);
        if (!fp) continue;

        if (fp.mime === ('audio/wav' satisfies MimeType)) newFiles.audio = path;
        if (fp.mime === ('audio/midi' satisfies MimeType)) newFiles.midi = path;
        if (fp.mime === ('text/plain' satisfies MimeType)) newFiles.text = path;
      }

      setFiles((o) => ({ ...o, ...newFiles }));
    },
    [setFiles],
  );

  // open file dialog
  const selectFiles = useCallback(async () => {
    const f = await open({
      title: 'Select an audio, text, or MIDI file, or all three at once.',
      multiple: true,
      filters: [{ name: 'files', extensions: ['wav', 'mid', 'txt'] }],
    });
    if (!f) return;

    processPaths(f);
  }, [processPaths]);

  // drag and drop
  useEffect(() => {
    const unlisten = getCurrentWebview().onDragDropEvent((e) => {
      const { type } = e.payload;

      if (type === 'enter') return setOnTop(true);
      if (type === 'leave') return setOnTop(false);
      if (type === 'drop') {
        setOnTop(false);
        processPaths(e.payload.paths);
      }
    });

    return () => {
      unlisten.then((cb) => cb());
    };
  }, []);

  const updateMarkers = useUpdateMarkers();
  useEffect(() => {
    updateMarkers();
  }, [files, updateMarkers]);

  return (
    <>
      <FileDialogProvider cb={selectFiles}>
        {children}
        {/*  */}
      </FileDialogProvider>
    </>
  );
}
