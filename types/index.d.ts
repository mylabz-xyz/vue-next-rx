import { Observer, Observable } from "rxjs";
import {
  App,
  DefineComponent,
  Ref as _Ref,
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
declare module "*.vue" {
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
import type { Vue } from "vue/types/vue";

declare module "vue/runtime-core" {
  interface ComponentCustomProperties {
    $prout: string;
    $subscriptions?: Observables | ((this: Vue) => Observables);
    $domStreams?: string[];
    $observableMethods?: string[] | Record<string, string>;
  }

  interface ComponentCustomOptions {
    prout: string;
  }
  interface ComponentCustomProps {
    prout: string;
  }
}
export function install(app: App): void;
