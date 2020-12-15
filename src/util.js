export let Vue;
export let warn = function (error) {
  console.log("vue-next-rx : " + error);
};

export function install(_Vue) {
  Vue = _Vue;
}

export function isObserver(subject) {
  return subject && typeof subject.next === "function";
}

export function defineReactive(vm, key, val) {
  vm[key] = val;
}

export function getKey(binding) {
  return [binding.arg].concat(Object.keys(binding.modifiers)).join(":");
}
