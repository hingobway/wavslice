import {
  getPathProps,
  InputFiles,
  useFileOnTop,
  useInputFiles,
  useRemoteConfirm,
  useSessionMarkers,
  useTSMETimestamps,
  useUpdateMarkers,
} from '@/ctx/filesState';
import { Children } from '@/utils/reactTypes';
import { useCallback, useEffect } from 'react';

import { getCurrentWebview } from '@tauri-apps/api/webview';
import { open } from '@tauri-apps/plugin-dialog';

import { MimeType } from '@/utils/mimeTypes';
import RemoteSessionDialog from './dialogs/RemoteSessionDialog';
import { UnlistenFn } from '@tauri-apps/api/event';
import { ipcEmit, ipcListen } from '@/func/ipc';
import { FileDialogProvider, TSMELoadingProvider } from '@/ctx/fileParseState';

const SESSION_FILE_EXTS = ['als', 'flp'];

export default function FileParseState({ children }: Children) {
  const [, setOnTop] = useFileOnTop();

  const [files, setFiles] = useInputFiles();

  const [remoteAllowed, setConfirmed] = useRemoteConfirm();

  const processPaths = useCallback(
    (files: string[]) => {
      const newFiles: InputFiles = {};
      for (const path of files) {
        const fp = getPathProps(path);
        if (!fp) continue;

        if (fp.mime === ('audio/wav' satisfies MimeType)) newFiles.audio = path;
        if (fp.mime === ('audio/midi' satisfies MimeType)) newFiles.midi = path;
        if (fp.mime === ('text/plain' satisfies MimeType)) newFiles.text = path;
        if (SESSION_FILE_EXTS.includes(fp.ext.toLowerCase())) {
          newFiles.session = path;
          setConfirmed(null);
          if (!remoteAllowed) RemoteSessionDialog.create();
          else ipcEmit('remote_confirm')(true);
        }
      }

      setFiles((o) => ({ ...o, ...newFiles }));
    },
    [remoteAllowed, setConfirmed, setFiles],
  );

  // open file dialog
  const selectFiles = useCallback(async () => {
    const f = await open({
      title: 'Select an audio, text, or MIDI file, or one of each:',
      multiple: true,
      filters: [
        {
          name: 'files',
          extensions: ['wav', 'mid', 'txt', ...SESSION_FILE_EXTS],
        },
      ],
    });
    if (!f) return;

    processPaths(f);
  }, [processPaths]);

  // tsme runner
  const [fetchTSME, isTSMELoading] = useTSMETimestamps();

  // ON MOUNT
  useEffect(() => {
    const evs: Promise<UnlistenFn>[] = [];

    // drag and drop
    evs.push(
      getCurrentWebview().onDragDropEvent((e) => {
        const { type } = e.payload;

        if (type === 'enter') return setOnTop(true);
        if (type === 'leave') return setOnTop(false);
        if (type === 'drop') {
          setOnTop(false);
          processPaths(e.payload.paths);
        }
      }),
    );

    // REMOTE LISTEN
    evs.push(
      ipcListen('remote_confirm')(async ({ payload: agreed }) => {
        setConfirmed(agreed);
        if (!agreed) return setFiles((f) => ({ ...f, session: undefined }));

        const success = await fetchTSME();
        console.log('TSME STATUS', success);
      }),
    );

    // unlisten
    return () => {
      for (const e of evs) {
        e.then((cb) => cb());
      }
    };
  }, [fetchTSME, processPaths, setConfirmed, setFiles, setOnTop]);

  // GET MARKER FILE DATA
  const updateMarkers = useUpdateMarkers();
  const [sessionMarkers] = useSessionMarkers();
  useEffect(() => {
    updateMarkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files, sessionMarkers]);

  return (
    <>
      <FileDialogProvider cb={selectFiles}>
        <TSMELoadingProvider value={isTSMELoading}>
          {children}
          {/*  */}
        </TSMELoadingProvider>
      </FileDialogProvider>
    </>
  );
}
