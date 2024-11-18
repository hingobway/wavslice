import { useCallback, useEffect, useState } from 'react';
import { Command } from '@tauri-apps/plugin-shell';

function App() {
  const [errors, setErrors] = useState<string[]>([]);
  errors;
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
      '-w',
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
  handleClick;

  return <> </>;
}

export default App;
