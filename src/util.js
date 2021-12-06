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

export function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}
