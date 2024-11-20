import { Command } from '@tauri-apps/plugin-shell';

const BINARY = 'bin/markers';

type ResponseType =
  | 'MARKERS'
  | 'COUNT'
  | 'MARKERS_NONE'
  | 'SR'
  | 'LENGTH'
  | 'ERROR';

// --------------------------------------------------------

export function runCommand(
  args: string[],
  msgHandler?: (line: string) => void,
) {
  return new Promise<boolean>((resolve) => {
    const cmd = Command.sidecar(BINARY, args);
    cmd.stdout.on('data', (line) => {
      if (checkErr(line)) return;
      msgHandler?.(line);
    });
    cmd.on('close', (data) => resolve(!data.code));
    cmd.spawn();
  });
}

export function getMsg(responseType: ResponseType, line: string) {
  const regex = new RegExp(`^${responseType} (.+)\\n$`);
  const m = line.match(regex);

  return m?.[1] ?? null;
}

function checkErr(line: string) {
  const error = getMsg('ERROR', line);
  if (error) {
    console.log('BACKEND ERROR', error);
    return true;
  }
  return false;
}
