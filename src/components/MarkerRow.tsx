import { ReactNode, useEffect, useState } from 'react';

import { Check } from 'lucide-react';
import { Checkbox } from '@headlessui/react';

export default function MarkerRow({
  markers: count,
  enabled,
  name,
  defaultName,
}: {
  name?: ReactNode;
  defaultName?: ReactNode;
  enabled?: boolean;
  markers: number;
}) {
  const [checked, setChecked] = useState(true);

  useEffect(() => {
    if (enabled) setChecked(!!count);
  }, [enabled]);
  useEffect(() => {
    if (count) setChecked(true);
  }, [count]);

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
          className="flex-1 data-[d]:text-zinc-400"
          data-d={!(enabled && !!name) || null}
        >
          {name ?? (defaultName && <span>{defaultName}</span>)}
        </div>
        <div
          className="group/m text-zinc-500 group-data-[e]:text-zinc-400"
          data-w={(enabled && count) || null}
        >
          <span className="group-data-[w]/m:text-zinc-100">{count}</span>
          <span className=""> markers</span>
        </div>
      </div>
    </>
  );
}
