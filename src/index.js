import { ref } from "./methods/ref";
import { watch } from "./methods/watch";

import { createObservableMethod } from "./methods/createObservableMethod";
import { fromDomEvent } from "./methods/fromDomEvent";
import { subscribeTo } from "./methods/subscribeTo";
import { watchAsObservable } from "./methods/watchAsObservable";

import streamDirective from "./directives/stream";

import rxMixin from "./mixin";

import { install as _install } from "./util";

//TODO: Work also with vue
export default {
  install: install,
};
export let _Vue;

export function install(Vue) {
  _install(Vue);
  Vue.mixin(rxMixin);
  Vue.directive("stream", streamDirective);
  Vue.config.globalProperties.$watchAsObservable = watchAsObservable;
  Vue.config.globalProperties.$fromDOMEvent = fromDomEvent;
  Vue.config.globalProperties.$subscribeTo = subscribeTo;
  Vue.config.globalProperties.$createObservableMethod = createObservableMethod;
  Vue.config.optionMergeStrategies.subscriptions = (toVal, fromVal) => {
    return fromVal || toVal;
  };
  this._Vue = Vue;
}

// auto install
export { ref, watch };
