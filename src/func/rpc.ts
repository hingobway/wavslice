import { Command } from '@tauri-apps/plugin-shell';

const BINARY = 'bin/markers';

// --------------------------------------------------------
// COMMANDS

export function getMidiMarkers(midiFilePath: string, sampleRate?: number) {
  return new Promise<number | null>((resolve) => {
    let count = 0;

    const args = ['-m', midiFilePath];
    if (sampleRate) args.push('' + sampleRate);
    const cmd = Command.sidecar(BINARY, args);
    cmd.stdout.on('data', (line) => {
      if (checkErr(line)) return;

      const c = getMsg('COUNT', line);
      if (c !== null && Number.isFinite(parseInt(c))) count = parseInt(c);
    });

    cmd.on('close', (data) => {
      if (data.code) resolve(null);
      else resolve(count);
    });

    cmd.spawn();
  });
}

// --------------------------------------------------------
// UTILS

function getMsg(messageType: string, line: string) {
  const regex = new RegExp(`^${messageType} (.+)\\n$`);
  const m = line.match(regex);

  return m?.[1] ?? null;
}

function checkErr(line: string) {
  const error = getMsg('ERROR', line);
  if (error) {
    console.log('CPP ERROR', error);
    return true;
  }
  return false;
}
