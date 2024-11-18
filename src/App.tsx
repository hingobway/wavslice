import { useCallback, useEffect, useState } from 'react';
import { Command } from '@tauri-apps/plugin-shell';

function App() {
  const [errors, setErrors] = useState<string[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    let a: number;
    if (msg?.length) a = setTimeout(() => setMsg(null), 10000);
    return () => clearTimeout(a);
  }, [msg]);

  const handleClick = useCallback(async () => {
    // // DIALOG TEST
    // const f = await open({
    //   multiple: false,
    //   directory: true,
    // });
    // console.log(f);
    // setMsg('done!');

    setMsg('loading...');
    setErrors([]);

    // run cli
    const cmd = Command.sidecar('bin/markers', [
      '/Users/michael/0-code/wav-markers/aud/mkrs_track.wav',
      '/Users/michael/0-code/wav-markers/ABCD.wav',
      '142222,711111,1280000,1848889,2702222,4266667',
    ]);

    cmd.on('close', (data) => {
      if (data.code) setMsg('an error occurred.');
      else setMsg('done!');
    });
    cmd.on('error', (error) => {
      console.log('error', error);
      setMsg('unkown error');
    });
    cmd.stdout.on('data', (line) => {
      const code = line.match(/ERROR ([^\n]+)/i)?.[1];
      if (code) setErrors((a) => [...a, code]);
    });

    cmd.spawn();
  }, []);

  return (
    <main className="bg-zinc-900 text-zinc-100 min-h-dvh flex flex-col justify-center gap-4 items-center">
      <h1 className="bg-zinc-800 rounded-2xl py-4 px-8">
        {msg ?? null}
        {!msg && <>Welcome to Tauri!</>}
      </h1>

      <button
        className="cursor-pointer bg-sky-600 rounded-full px-4 py-1 text-sm lowercase"
        onClick={handleClick}
      >
        Click Me
      </button>
    </main>
  );
}

export default App;
