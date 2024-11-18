import { open } from '@tauri-apps/plugin-dialog';

import './App.css';
import { useCallback, useEffect, useState } from 'react';

function App() {
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    let a: number;
    if (msg?.length) a = setTimeout(() => setMsg(null), 5000);
    return () => clearTimeout(a);
  }, [msg]);

  const handleClick = useCallback(async () => {
    const f = await open({
      multiple: false,
      directory: true,
    });
    console.log(f);
    setMsg('done!');
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
