import { emit, listen } from '@tauri-apps/api/event';

export type IPCEventPayloads = {
  remote_confirm: boolean;
};

// --------------------------------------------------

export type IPCEvent = keyof IPCEventPayloads;

export const ipcListen = <T extends IPCEvent>(name: T) => {
  type CBT = typeof listen<IPCEventPayloads[T]>;
  return (acb: Parameters<CBT>[1], aop?: Parameters<CBT>[2]) =>
    listen<IPCEventPayloads[T]>(name, acb, aop);
};

export const ipcEmit =
  <T extends IPCEvent>(name: T) =>
  (payload: IPCEventPayloads[T]) =>
    emit(name, payload);
