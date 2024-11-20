import { useCallback, useState } from 'react';

export function useLoading() {
  const [isLoading, setIsLoading] = useState(false);

  const loader = useCallback(async (cb: () => Promise<unknown>) => {
    setIsLoading(true);
    await cb();
    setIsLoading(false);
  }, []);

  return [isLoading, loader] as const;
}
