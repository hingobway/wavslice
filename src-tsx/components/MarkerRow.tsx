import { ReactNode, useCallback, useEffect } from 'react';

import { Check } from 'lucide-react';
import { Checkbox } from '@headlessui/react';
import {
  Markers,
  useGlobalIsLoading,
  useSelectedMarkers,
} from '@/ctx/fileDrop';
import { SetState } from '@/utils/reactTypes';

export default function MarkerRow({
  markers: count,
  markerName,
  enabled,
  name,
  defaultName,
}: {
  name?: ReactNode;
  defaultName?: ReactNode;
  enabled?: boolean;
  markers: number;
  markerName: keyof Markers;
}) {
  const [sel, setSel] = useSelectedMarkers();
  const checked = sel[markerName];
  const setChecked: SetState<typeof checked> = useCallback(
    (arg) =>
      setSel((prev) => ({
        ...prev,
        [markerName]: typeof arg === 'function' ? arg(prev[markerName]) : arg,
      })),
    [markerName, setSel],
  );

  useEffect(() => {
    if (enabled) setChecked(!!count);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);
  useEffect(() => {
    if (count) setChecked(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  const isLoading = useGlobalIsLoading();

  return (
    <>
      <div
        className="group flex flex-row items-center gap-4 px-4 py-1 transition data-[e]:cursor-pointer data-[e]:bg-zinc-700 hover:[&:not(:has([data-disabled]))]:data-[e]:bg-opacity-80"
        data-e={enabled || null}
        onClick={() => setChecked((c) => !c)}
      >
        <Checkbox
          checked={enabled && checked}
          disabled={!enabled}
          onChange={setChecked}
          onClick={(e) => e.stopPropagation()}
          className="group/c flex size-[0.875rem] items-center justify-center rounded-[3px] bg-white/10 transition data-[checked]:bg-sky-600 group-hover:group-data-[e]:bg-zinc-900/50"
        >
          <Check className="hidden size-3 text-zinc-100 group-data-[checked]/c:block" />
        </Checkbox>
        <div
          className="flex-1 truncate text-nowrap data-[d]:text-zinc-400"
          data-d={!(enabled && !!name) || null}
        >
          {name ?? (defaultName && <span>{defaultName}</span>)}
        </div>
        <div
          className="group/m text-zinc-500 group-data-[e]:text-zinc-400"
          data-w={(enabled && count) || null}
        >
          {/* loading spinner */}
          {isLoading && (
            <>
              <Spinner />
              <span className="inline-block w-0.5"></span>
            </>
          )}
          {/* count */}
          {!isLoading && (
            <span className="group-data-[w]/m:text-zinc-100">{count}</span>
          )}
          <span className=""> markers</span>
        </div>
      </div>
    </>
  );
}

function Spinner() {
  return (
    <div className="inline-block size-2 animate-spin rounded-full border border-zinc-500 border-t-transparent" />
  );
}
