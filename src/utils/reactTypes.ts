import { ReactNode } from 'react';

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export type UseState<T> = [T, SetState<T>];

export type Children = {
  children?: ReactNode;
};

export type Key = { key?: React.Key };

export type ComponentProps<T extends (...args: any) => any> = Parameters<T>[0];
