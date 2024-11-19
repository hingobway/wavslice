import { useContext } from 'react';
import { createContext } from 'react';
import { Children } from './reactTypes';

/**
 * create a simple callback function that can be passed in context.
 *
 * @example
 * // parent.tsx
 * const {
 *   Provider: MyFunctionProvider,
 *   useHook: useMyFunction,
 * } = createCallbackCtx();
 * export { useMyFunction };
 *
 * // ParentComponent
 * return (
 *   <MyFunctionProvider cb={handleMyFunction}>
 *     <ChildComponent />
 *   </MyFunctionProvider>
 * );
 *
 * // ChildComponent
 * const runMyFunction = useMyFunction();
 * runMyFunction();
 */
export function createCallbackCtx<
  CbType extends (...p: any[]) => any = () => void,
>() {
  const ctx = createContext<CbType | null>(null);

  function Provider({ cb, children }: { cb: CbType } & Children) {
    return <ctx.Provider value={cb}>{children}</ctx.Provider>;
  }

  function useHook() {
    return useContext(ctx);
  }

  return { Provider, useHook };
}
