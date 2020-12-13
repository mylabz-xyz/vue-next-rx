import { Observer, Observable } from "rxjs";
import {
  Component,
  ComponentCustomOptions,
  ComponentOptionsMixin,
  ComputedOptions,
  DefineComponent,
  Directive,
  EmitsOptions,
  MethodOptions,
  Ref as _Ref,
  RenderFunction,
  SetupContext,
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
declare module "vue" {
  interface _Vue extends Vue {}
  interface ComponentOptions {
    prout: string;
    subscriptions?: Observables | ((this: Vue) => Observables);
    domStreams?: string[];
    observableMethods?: string[] | Record<string, string>;
  }

  interface ComponentOptionsBase<
    Props,
    RawBindings,
    D,
    C extends ComputedOptions,
    M extends MethodOptions,
    Mixin extends ComponentOptionsMixin,
    Extends extends ComponentOptionsMixin,
    E extends EmitsOptions,
    EE extends string = string,
    Defaults = {}
  > extends LegacyOptions<Props, D, C, M, Mixin, Extends>,
      ComponentInternalOptions,
      ComponentCustomOptions {
    setup?: (
      this: string,
      props: Props,
      ctx: SetupContext<E>
    ) => Promise<RawBindings> | RawBindings | RenderFunction | void;
    name?: string;
    prout: string;
    template?: string | object;
    render?: Function;
    components?: Record<string, Component>;
    directives?: Record<string, Directive>;
    inheritAttrs?: boolean;
    emits?: (E | EE[]) & ThisType<void>;
    expose?: string[];
    serverPrefetch?(): Promise<any>;
    /* Excluded from this release type: ssrRender */
    /* Excluded from this release type: __ssrInlineRender */
    /* Excluded from this release type: __asyncLoader */
    /* Excluded from this release type: __merged */
    call?: (this: unknown, ...args: unknown[]) => never;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
    __defaults?: Defaults;
  }
}
