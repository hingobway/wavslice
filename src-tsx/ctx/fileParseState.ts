import { createCallbackCtx } from '@/utils/callback';
import { createContext, useContext } from 'react';

const { Provider: FileDialogProvider, useHook: useOpenFileDialog } =
  createCallbackCtx();
export { useOpenFileDialog, FileDialogProvider };

const loadCtx = createContext(false);
export const useTSMELoading = () => useContext(loadCtx);
export const TSMELoadingProvider = loadCtx.Provider;
