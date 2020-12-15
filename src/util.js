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
  vm[key] = val;
}

export function getKey(binding) {
  return [binding.arg].concat(Object.keys(binding.modifiers)).join(":");
}
