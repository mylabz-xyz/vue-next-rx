import { Observer, Observable } from "rxjs";
import {
  Ref as _Ref,
  WatchOptions,
  WatchStopHandle as _WatchStopHandle,
} from "vue";

export type Observables = Record<string, Observable<any>>;
export interface WatchObservable<T> {
  newValue: T;
  oldValue: T;
}
export type Ref<T = any> = _Ref<T> & Observer<T> & Observable<T>;

export type WatchStopHandle<T = any> = Observer<T> &
  Observable<T> &
  (() => void);

export function ref(value: unknown): Ref;

export function watch(ref: Ref, fn?: (val: any) => any): WatchStopHandle;

declare module "vue/types/vue" {
  interface Vue {
    $observables: Observables;
    $watchAsObservable(
      expr: string,
      options?: WatchOptions
    ): Observable<WatchObservable<any>>;
    $watchAsObservable<T>(
      fn: (this: this) => T,
      options?: WatchOptions
    ): Observable<WatchObservable<T>>;
    $eventToObservable(event: string): Observable<{ name: string; msg: any }>;
    $fromDOMEvent(selector: string | null, event: string): Observable<Event>;
    $createObservableMethod(methodName: string): Observable<any>;
  }
}
