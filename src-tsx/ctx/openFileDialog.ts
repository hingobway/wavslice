import { createCallbackCtx } from '@/utils/callback';

const { Provider: FileDialogProvider, useHook: useOpenFileDialog } =
  createCallbackCtx();
export { useOpenFileDialog, FileDialogProvider };
