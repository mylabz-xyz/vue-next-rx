/* eslint-env jest */

"use strict";

const { mount, config } = require("@vue/test-utils");
const VueNextRx = require("../dist/rx-vue-next.js");

// library
const { Observable } = require("rxjs");
const { startWith } = require("rxjs/operators");

config.global.plugins.push(VueNextRx);

const defaultTemplate = "<div id='test'>Hello world</div>";

function mock() {
  let observer;
  const observable = new Observable((_observer) => {
    observer = _observer;
  });
  return {
    ob: observable,
    next: (val) => observer.next(val),
  };
}

test("Subscriptions Basic", () => {
  const { ob, next } = mock();
  const component = {
    template: defaultTemplate,
    subscriptions() {
      return { hello: ob.pipe(startWith(0)) };
    },
  };
  const wrapper = mount(component);

  const results = [];
  wrapper.componentVM.$observables.hello.subscribe((val) => {
    results.push(val);
  });

  next(1);
  next(2);
  next(3);
  expect(results).toEqual([0, 1, 2, 3]);
  // Assert the rendered text of the component
  expect(wrapper.text()).toContain("Hello world");
});
