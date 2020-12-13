import ref from "./methods/ref";
import watch from "./methods/watch";
import watchEffect from "./methods/watchEffect";

import createObservableMethod from "./methods/createObservableMethod";
import eventToObservable from "./methods/eventToObservable";
import fromDomEvent from "./methods/fromDomEvent";

console.log("link success");

//TODO: Work also with vue 2
export default {
  install: (app, options) => {
    // Plugin code goes here
    console.log("hello install");

    console.log(app);

    console.warn("--------------------------------------");

    console.log(options);
  },
};

export {
  ref,
  watch,
  watchEffect,
  fromDomEvent,
  createObservableMethod,
  eventToObservable,
};
