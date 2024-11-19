import {
  atom,
  selector,
  useRecoilCallback,
  useRecoilState,
  useRecoilValue,
} from 'recoil';

import MIME from 'mime/lite';
import { useCallback } from 'react';
import { getMidiMarkers } from '@/func/rpc';

const fileOnTopState = atom<boolean>({
  key: 'FileOnTop',
  default: false,
});
export const useFileOnTop = () => useRecoilState(fileOnTopState);

export type InputFiles = {
  audio?: string;
  midi?: string;
  text?: string;
};
type InputFilesObject = Record<keyof InputFiles, PathProps | null>;
const inputFilesState = atom<InputFiles>({
  key: 'InputFiles',
  default: {},
});
const inputFilesObjectState = selector<InputFilesObject>({
  key: 'InputFilesObject',
  get({ get }) {
    const files = get(inputFilesState);
    return Object.keys(files).reduce(
      (o, k) => ({ ...o, [k]: getPathProps(files[k as keyof InputFiles]) }),
      {} as InputFilesObject,
    );
  },
});
export const useInputFileObjects = () => useRecoilValue(inputFilesObjectState);
export const useInputFiles = () => useRecoilState(inputFilesState);

export type Markers = Record<keyof InputFiles, number[]> & {
  sampleRate?: number;
};
const markersDefault: Markers = {
  audio: [],
  midi: [],
  text: [],
};
const markersState = atom<Markers>({
  key: 'Markers',
  default: markersDefault,
});
export const useMarkers = () => useRecoilState(markersState);

export const useUpdateMarkers = () => {
  const cb = useRecoilCallback(({ snapshot, set }) => async () => {
    const files = await snapshot.getPromise(inputFilesState);
    const markers = { ...markersDefault };

    if(files.audio){
      
    }

    if (files.midi) {
      const md = (await getMidiMarkers(files.midi)) ?? 0;
      markers.midi = Array(md).fill(0);
    }

    set(markersState, markers);
  });
  return cb;
};

// -------------------------------------------

export function getPathProps(path?: string | null) {
  const ms = path?.match(/^(.+[\/\\])([^\/\\]*\.([^\.\/\\]+))$/);
  if (!ms) return null;

  return {
    path,
    folder: ms[1],
    name: ms[2],
    ext: ms[3],
    mime: MIME.getType(ms[3]),
  };
}
type PathProps = ReturnType<typeof getPathProps> & {};

export function useFullReset() {
  const [, setFiles] = useInputFiles();
  const [, setMarkers] = useMarkers();

  const cb = useCallback(() => {
    setFiles({});
    setMarkers({ ...markersDefault });
  }, [setFiles, setMarkers]);
  return cb;
}
