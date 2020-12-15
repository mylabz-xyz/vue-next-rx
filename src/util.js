import { provide, reactive, ref } from "vue";

export let Vue;
export let warn = function () {};

export function install(_Vue) {
  Vue = _Vue;
}

export function isObservable(ob) {
  return ob && typeof ob.subscribe === "function";
}

export function isObserver(subject) {
  return subject && typeof subject.next === "function";
}

export function defineReactive(vm, key, val) {
  console.log(vm);
  if (key in vm) {
    vm[key] = val;
  } else {
    let handler = {};
    handler[key] = reactive({ [key]: val });
    provide(key, handler[key]);
  }
}

export function getKey(binding) {
  return [binding.arg].concat(Object.keys(binding.modifiers)).join(":");
}
