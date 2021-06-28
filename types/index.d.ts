import { Observer, Observable, Unsubscribable } from "rxjs";
import {
  App,
  DefineComponent,
  Ref as _Ref,
  WatchStopHandle as _WatchStopHandle,
} from "vue";
import { WatchOptions } from "vue/types/options";

export type Observables = Record<string, Observable<any>>;
export interface WatchObservable<T> {
  newValue: T;
  oldValue: T;
}
export type Ref<T = any> = _Ref<T> & Observer<T> & Observable<T>;

export type WatchStopHandle<T = any> = Observer<T> &
  Observable<T> &
  Unsubscribable &
  (() => void);

export function ref(value: unknown): Ref;

export function watch(ref: Ref, fn?: (val: any) => any): WatchStopHandle;

export function watchEffect(fn?: () => any): WatchStopHandle;

declare module "*.vue" {
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
import type { Vue } from "vue/types/vue";

declare module "vue" {
  interface ComponentCustomProperties {}

  interface ComponentCustomOptions {
    domStreams?: string[];
    subscriptions?:
      | Observables
      | ((this: Vue & { [key: string]: Observables | any }) => Observables);
    observableMethods?: string[] | Record<string, string>;
  }
  interface ComponentCustomProperties {
    $observables: Observables;
    $watchAsObservable(
      expr: string,
      options?: WatchOptions
    ): Observable<WatchObservable<any>>;
    $watchAsObservable<T>(
      fn: (this: this) => T,
      options?: WatchOptions
    ): Observable<WatchObservable<T>>;
    $fromDOMEvent(selector: string | null, event: string): Observable<Event>;
    $createObservableMethod(methodName: string): Observable<any>;
  }
}
export function install(app: App): void;
