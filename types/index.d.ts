import { Observer, Observable } from "rxjs";
import { Ref as _Ref, WatchStopHandle as _WatchStopHandle } from "vue";

export type Ref<T = any> = _Ref<T> & Observer<T> & Observable<T>;

export type WatchStopHandle<T = any> = Observer<T> &
  Observable<T> &
  (() => void);

export function ref(value: unknown): Ref;

export function watch(ref: Ref, fn?: (val: any) => any): WatchStopHandle;
