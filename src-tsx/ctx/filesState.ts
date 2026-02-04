import {
  atom,
  selector,
  useRecoilCallback,
  useRecoilState,
  useRecoilValue,
} from 'recoil';

import MIME from 'mime/lite';
import { useCallback } from 'react';
import { readAudioFile, readMidiFile, readSessionFile } from '@/rpc/commands';
import { useLoading } from '@/utils/transition';
import { getSessionMarkers } from '@/func/tsme';

export const MAX_MARKERS = 100;

// FILE STATE

const fileOnTopState = atom<boolean>({
  key: 'FileOnTop',
  default: false,
});
export const useFileOnTop = () => useRecoilState(fileOnTopState);

export type InputFiles = {
  audio?: string;
  midi?: string;
  text?: string;
  session?: string;
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

const audioLengthState = atom<number | null>({
  key: 'AudioLength',
  default: null,
});
export const useAudioLength = () => useRecoilState(audioLengthState);

// MARKERS STATE

export type Markers = Record<keyof InputFiles, number[]>;
const markersDefault: Markers = {
  audio: [],
  midi: [],
  text: [],
  session: [],
};
const markersState = atom<Markers>({
  key: 'Markers',
  default: markersDefault,
});
export const useMarkers = () => useRecoilState(markersState);

const markersListState = selector<number[]>({
  key: 'MarkersList',
  get({ get }) {
    const markersObject = get(markersState);
    const selectedMarkers = get(selectedMarkersState);
    const maxSamples = get(audioLengthState);

    // prep markers
    const markers: number[] = [];
    for (const key of Object.keys(markersObject)) {
      if (!selectedMarkers[key as keyof SelectedMarkers]) continue;
      for (const marker of markersObject[key as keyof Markers]) {
        if (
          marker > 0 &&
          (!maxSamples || marker <= maxSamples) &&
          !markers.includes(marker)
        )
          markers.push(marker);
      }
    }

    return markers.sort((a, b) => a - b);
  },
});
export const useMarkersList = () => useRecoilValue(markersListState);

type SelectedMarkers = Record<keyof Markers, boolean>;
const defaultSelectedMarkers: SelectedMarkers = {
  audio: false,
  midi: false,
  text: false,
  session: false,
};
const selectedMarkersState = atom({
  key: 'SelectedMarkers',
  default: defaultSelectedMarkers,
});
export const useSelectedMarkers = () => useRecoilState(selectedMarkersState);

const sessionMarkersState = atom<number[] | null>({
  key: 'SessionMarkers',
  default: null,
});
export const useSessionMarkers = () => useRecoilState(sessionMarkersState);

const remoteConfirmState = atom<boolean | null>({
  key: 'RemoteConfirm',
  default: null,
});
export const useRemoteConfirm = () => useRecoilState(remoteConfirmState);

const globalLoadingState = atom({
  key: 'GlobalLoading',
  default: false,
});
export const useGlobalIsLoading = () => useRecoilValue(globalLoadingState);

export const useUpdateMarkers = () => {
  const cb = useRecoilCallback(
    ({ snapshot: { getPromise: get }, set }) =>
      async () => {
        set(globalLoadingState, true);

        const files = await get(inputFilesState);

        const markers = { ...markersDefault };
        let sampleRate = 0;
        let audioLength = 0;

        if (files.audio) {
          const aud = await readAudioFile(files.audio);
          if (aud) {
            markers.audio = aud.markers;
            sampleRate = aud.sampleRate;
            audioLength = aud.samples;
          }
        }

        if (files.midi) {
          if (sampleRate) {
            // if possible, get markers
            const ms = await readMidiFile(files.midi, sampleRate);
            if (ms) markers.midi = ms;
          } else {
            // otherwise, just count them
            const md = (await readMidiFile(files.midi)) ?? 0;
            markers.midi = Array(md).fill(0);
          }
        }

        if (files.session) {
          const ms = await readSessionFile(files.session, sampleRate);
          if (ms) markers.session = ms;
        }

        set(markersState, markers);
        set(audioLengthState, audioLength);
        set(globalLoadingState, false);
      },
  );
  return cb;
};

/** parse TSME timestamps on the web. callback returns true if successful.
 * @returns [callback, isLoading]
 */
export function useTSMETimestamps() {
  // state needed
  const [files] = useInputFiles();
  const [, setMarkers] = useSessionMarkers();

  // function
  const [isLoading, loading] = useLoading<boolean>();
  const cb = useCallback(
    (sessionFileOverride?: string) =>
      loading(async () => {
        if (!sessionFileOverride && !files.session) return false;

        const ms = await getSessionMarkers(
          sessionFileOverride ?? files.session!,
        ).catch((e) => console.log('TSME ERROR', e?.message));
        if (!ms) return false;

        setMarkers(ms);
        return true;
      }),
    [files.session, loading, setMarkers],
  );

  return [cb, isLoading] as const;
}

// -------------------------------------------

export function getPathProps(path?: string | null) {
  const ms = path?.match(/^(.+[/\\])(([^/\\]*)\.([^./\\]+))$/);
  if (!ms) return null;

  return {
    /** full absolute file path */
    path: path!,
    /** absolute path of containing folder */
    folder: ms[1],
    /** file name including extension */
    name: ms[2],
    /** file name without extension */
    nameNoExt: ms[3],
    /** file extension (with no period) */
    ext: ms[4],
    /** MIME type if found */
    mime: MIME.getType(ms[4]),
  };
}
type PathProps = ReturnType<typeof getPathProps> & {};

export function useFullReset() {
  const [, setFiles] = useInputFiles();
  const [, setMarkers] = useMarkers();
  const [, setSessionMarkers] = useSessionMarkers();

  const cb = useCallback(() => {
    setFiles({});
    setMarkers({ ...markersDefault });
    setSessionMarkers(null);
  }, [setFiles, setMarkers, setSessionMarkers]);
  return cb;
}
