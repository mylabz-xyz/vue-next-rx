import { reactive } from "vue";

export let warn = function () {};

export function isObservable(ob) {
  return ob && typeof ob.subscribe === "function";
}

export function isObserver(subject) {
  return subject && typeof subject.next === "function";
}

//(Boucham) Vue.util.defineReactive(vm, key, val) => reactive({ [key]: val });
export function defineReactive(vm, key, val) {
  if (key in vm) {
    vm[key] = val;
  } else {
    reactive({ [key]: val });
  }
}

export function getKey(binding) {
  return [binding.arg].concat(Object.keys(binding.modifiers)).join(":");
}
