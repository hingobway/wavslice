import IconSearch from './svg/IconSearch';

export default function App() {
  return (
    <>
      <div className="flex min-h-dvh flex-col gap-2 p-2 pt-0">
        {/* header */}
        <header className="flex flex-row items-center justify-between rounded-b-xl bg-zinc-800 px-4 py-1">
          <div className="text-lg">wavslice.</div>
          <div className="text-xs font-bold text-zinc-400">[foster]</div>
        </header>

        {/* main section */}
        <main className="flex flex-1 flex-col gap-6 p-6 text-sm">
          {/* audio file */}
          <div className="flex flex-col gap-1">
            <div className="px-3">Choose audio file:</div>

            <div className="flex h-7 flex-row justify-end rounded-full border border-zinc-400 p-2">
              <button className="flex items-center justify-center text-zinc-400">
                <IconSearch />
              </button>
            </div>
          </div>

          {/* marker selector */}
          <div className="flex flex-1 flex-col gap-1">
            <div className="flex flex-row justify-between px-3">
              <div className="">Choose markers to include:</div>
              <button className="flex items-center justify-center text-zinc-400">
                <IconSearch />
              </button>
            </div>

            {/* list */}
            <div className="outsi flex flex-col overflow-hidden rounded-lg border border-zinc-400 bg-zinc-800 p-px text-xs">
              {/* entry */}
              <div className="flex flex-row items-center gap-4 px-4 py-1 odd:bg-zinc-700">
                <div className="size-[0.875rem] rounded-[3px] bg-sky-600"></div>
                <div className="flex-1">Original Audio File</div>
                <div className="">
                  <span className="t">3</span>
                  <span className="text-zinc-400"> markers</span>
                </div>
              </div>
              {/* entry */}
              <div className="flex flex-row items-center gap-4 px-4 py-1 odd:bg-zinc-700">
                <div className="size-[0.875rem] rounded-[3px] bg-zinc-600"></div>
                <div className="flex-1">MIDI File</div>
                <div className="">
                  <span className="t">0</span>
                  <span className="text-zinc-400"> markers</span>
                </div>
              </div>
              {/* entry */}
              <div className="flex flex-row items-center gap-4 px-4 py-1 odd:bg-zinc-700">
                <div className="size-[0.875rem] rounded-[3px] bg-zinc-600"></div>
                <div className="flex-1">Text File</div>
                <div className="">
                  <span className="t">2</span>
                  <span className="text-zinc-400"> markers</span>
                </div>
              </div>
            </div>

            <div className="mt-2 flex flex-row justify-end px-2">
              <div className="text-right text-xs">
                <span>23</span>
                <span className="text-zinc-400"> / 100 max</span>
              </div>
            </div>
          </div>

          {/* save section */}
          <div className="flex flex-row">
            <div className="flex-1 text-xs text-zinc-400">
              <p className="px-3">
                You can drag files into this window, or select both files at the
                same time.
              </p>
            </div>

            <div className="">
              <button className="rounded-full bg-sky-600 px-6 py-1 text-sm font-bold">
                Save
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
