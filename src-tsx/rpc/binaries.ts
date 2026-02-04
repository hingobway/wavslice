import config from '@/../src-tauri/tauri.conf.json';

const binariesList = config.bundle.externalBin;

export const BINARIES = {
  main: binariesList[0],
  tsme: binariesList[1],
} as const;
