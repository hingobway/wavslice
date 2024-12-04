import { useAudioLength, useMarkersList } from '@/ctx/fileDrop';
import { clmx } from '@/utils/classConcat';

export default function MarkerVis() {
  const [maxTime] = useAudioLength();
  const markers = useMarkersList();

  return (
    <>
      <div className="">
        {/* markers vis */}
        <div
          className={clmx(
            'relative h-4 rounded-md border border-zinc-800 bg-zinc-900 transition',
            /* conditional bg */ !!maxTime && 'bg-zinc-950',
          )}
        >
          {!!maxTime &&
            markers.map((c) => (
              <div
                key={c}
                className="absolute -top-0.5 bottom-0.5 w-px bg-zinc-400"
                style={{ left: `${(c / maxTime) * 100}%` }}
              >
                <div className="absolute -left-0.5 top-0 ml-[0.5px] size-1 rounded-full bg-zinc-400" />
              </div>
            ))}

          {!!maxTime && (
            <div className="invisible absolute inset-0 -mt-px text-center text-xs italic text-zinc-700 first:visible">
              no markers selected
            </div>
          )}
        </div>
      </div>
    </>
  );
}
