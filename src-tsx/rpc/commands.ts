import * as rpc from './rpc';

export async function readAudioFile(filePath: string) {
  let markers: number[] = [];
  let SR = 0;
  let samples = 0;

  const success = await rpc.runCommand(['-a', filePath], (line) => {
    // process incoming markers
    const ms = rpc.getMsg('MARKERS', line);
    if (ms) {
      markers = parseMarkersString(ms);
      return;
    }

    // get sample rate
    const sr = rpc.getMsg('SR', line);
    if (sr) {
      const n = parseInt(sr);
      if (Number.isFinite(n)) SR = n;
    }

    // get length
    const samp = rpc.getMsg('LENGTH', line);
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
  const success = await rpc.runCommand(args, (line) => {
    const ms = rpc.getMsg('MARKERS', line);
    if (ms) {
      markers = parseMarkersString(ms);
      return;
    }

    const c = rpc.getMsg('COUNT', line);
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

  const success = await rpc.runCommand(['-w', inputFile, outputFile, mlist]);

  return success;
}

// --------------------------------------------------------
// UTILS

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
