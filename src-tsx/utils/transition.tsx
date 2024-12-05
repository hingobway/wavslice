import { useCallback, useState } from 'react';

export function useLoading<T = void>() {
  const [isLoading, setIsLoading] = useState(false);

  const loader = useCallback(async (cb: () => Promise<T>) => {
    setIsLoading(true);
    const output = await cb();
    setIsLoading(false);

    return output;
  }, []);

  return [isLoading, loader] as const;
}
