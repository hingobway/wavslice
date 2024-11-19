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
// COMMANDS

export async function readAudioFile(filePath: string) {
  let markers: number[] = [];
  let SR = 0;
  let samples = 0;

  const success = await runCommand(['-a', filePath], (line) => {
    // process incoming markers
    const ms = getMsg('MARKERS', line);
    if (ms) {
      markers = parseMarkersString(ms);
      return;
    }

    // get sample rate
    const sr = getMsg('SR', line);
    if (sr) {
      const n = parseInt(sr);
      if (Number.isFinite(n)) SR = n;
    }

    // get length
    const samp = getMsg('LENGTH', line);
    if (samp) {
      const n = parseInt(samp);
      if (Number.isFinite(n)) samples = n;
    }
  });

  if (success && typeof SR === 'number')
    return { markers, sampleRate: SR, samples };
  return null;
}

export function readMidiFile(filePath: string): Promise<number | null>;
export function readMidiFile(
  filePath: string,
  sampleRate: number,
): Promise<number[] | null>;
export async function readMidiFile(
  filePath: string,
  sampleRate?: number,
): Promise<number | number[] | null> {
  let count = 0;
  let markers: number[] = [];

  const args = ['-m', filePath];
  if (sampleRate) args.push('' + sampleRate);
  const success = await runCommand(args, (line) => {
    const ms = getMsg('MARKERS', line);
    if (ms) {
      markers = parseMarkersString(ms);
      return;
    }

    const c = getMsg('COUNT', line);
    if (c !== null && Number.isFinite(parseInt(c))) count = parseInt(c);
  });

  if (!success) return null;
  if (typeof sampleRate === 'number') return markers;
  return count;
}

export async function writeAudioFile(
  inputFile: string,
  outputFile: string,
  markers: number[],
) {
  const mlist = markers.join(',');

  const success = await runCommand(['-w', inputFile, outputFile, mlist]);

  return success;
}

// --------------------------------------------------------
// UTILS

function runCommand(args: string[], msgHandler?: (line: string) => void) {
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

function getMsg(responseType: ResponseType, line: string) {
  const regex = new RegExp(`^${responseType} (.+)\\n$`);
  const m = line.match(regex);

  return m?.[1] ?? null;
}

function parseMarkersString(mlist: string) {
  const markers: number[] = [];

  const matches = mlist.match(/\d+/g);
  if (!matches) return markers;
  for (const s of matches) {
    const n = parseInt(s);
    if (Number.isFinite(n)) markers.push(n);
  }
  return markers;
}

function checkErr(line: string) {
  const error = getMsg('ERROR', line);
  if (error) {
    console.log('BACKEND ERROR', error);
    return true;
  }
  return false;
}
