/* eslint-env jest */

"use strict";

const { mount, config } = require("@vue/test-utils");
const VueNextRx = require("../dist/vue-next-rx.js");
const { Observable } = require("rxjs");
const {
  startWith,
  map,
  tap,
  scan,
  merge,
  filter,
  pluck,
} = require("rxjs/operators");

config.global.plugins.push(VueNextRx);

const defaultTemplate = "<div id='test'>Hello world</div>";
const varTemplate = (val) => `<div id='test'>{{${val}}}</div>`;

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

function trigger(target, event) {
  var e = document.createEvent("HTMLEvents");
  e.initEvent(event, true, true);
  target.dispatchEvent(e);
}

function click(target) {
  trigger(target, "click");
}

test("Expose observable", () => {
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

test("Bind subscriptions to render", (done) => {
  const { ob, next } = mock();
  const component = {
    template: varTemplate("hello"),
    subscriptions() {
      return { hello: ob.pipe(startWith("foo")) };
    },
  };
  const wrapper = mount(component);

  expect(wrapper.text()).toBe("foo");

  next("bar");
  wrapper.componentVM.$nextTick(() => {
    expect(wrapper.text()).toBe("bar");
  });
  done();
});

test("subscriptions() has access to component inject", () => {
  const { ob } = mock();

  const component = {
    template: varTemplate("hello"),
    data() {
      return { foo: "FOO" };
    },
    inject: { bar: { default: "BAR" } },
    subscriptions() {
      return {
        hello: ob.pipe(startWith(this.foo + this.bar)),
      };
    },
  };

  const wrapper = mount(component);

  expect(wrapper.text()).toBe("FOOBAR");
});

test("subscriptions() can throw error properly", (done) => {
  const { ob, next } = mock();
  let thrownError;

  const component = {
    template: varTemplate("num"),
    subscriptions() {
      return {
        num: ob.pipe(
          startWith(1),
          map((n) => n.toFixed()),
          tap({
            error(err) {
              thrownError = err;
            },
          })
        ),
      };
    },
  };

  const wrapper = mount(component);

  wrapper.componentVM.$nextTick(() => {
    next(null);

    wrapper.componentVM.$nextTick(() => {
      expect(thrownError).toBeDefined();
      expect(wrapper.text()).toBe("1");
      done();
    });
  });
});

test("v-stream directive (basic)", (done) => {
  const component = {
    template: `
      <div>
        <span class="count">{{ count }}</span>
        <button v-stream:click="click$">+</button>
      </div>
    `,
    domStreams: ["click$"],
    subscriptions() {
      return {
        count: this.click$.pipe(
          map(() => 1),
          startWith(0),
          scan((total, change) => total + change)
        ),
      };
    },
  };

  const wrapper = mount(component);

  expect(wrapper.element.querySelector("span").textContent).toBe("0");
  click(wrapper.element.querySelector("button"));
  wrapper.componentVM.$nextTick(() => {
    expect(wrapper.element.querySelector("span").textContent).toBe("1");
    done();
  });
});

test("v-stream directive (with .native modify)", (done) => {
  const component = {
    template: `
      <div>
        <span class="count">{{ count }}</span>
        <my-button id="btn-native" v-stream:click.native="clickNative$">+</my-button>
        <my-button id="btn" v-stream:click="click$">-</my-button>
      </div>
    `,
    components: {
      myButton: {
        template: "<button>MyButton</button>",
      },
    },
    domStreams: ["clickNative$", "click$"],
    subscriptions() {
      return {
        count: this.clickNative$.pipe(
          merge(this.click$),
          filter((e) => e.event.target && e.event.target.id === "btn-native"),
          map(() => 1),
          startWith(0),
          scan((total, change) => total + change)
        ),
      };
    },
  };

  const wrapper = mount(component);

  expect(wrapper.element.querySelector("span").textContent).toBe("0");
  click(wrapper.element.querySelector("#btn"));
  click(wrapper.element.querySelector("#btn"));
  click(wrapper.element.querySelector("#btn-native"));
  wrapper.componentVM.$nextTick(() => {
    expect(wrapper.element.querySelector("span").textContent).toBe("1");
    done();
  });
});

test("v-stream directive (with .stop, .prevent modify)", (done) => {
  const component = {
    template: `
      <form>
        <span>{{stoped}} {{prevented}}</span>
        <button id="btn-stop" v-stream:click.stop="clickStop$">Stop</button>
        <button id="btn-prevent" type="submit" v-stream:click.prevent="clickPrevent$">Submit</button>
      </form>
    `,
    domStreams: ["clickStop$", "clickPrevent$"],
    subscriptions() {
      return {
        stoped: this.clickStop$.pipe(map((x) => x.event.cancelBubble)),
        prevented: this.clickPrevent$.pipe(
          map((x) => x.event.defaultPrevented)
        ),
      };
    },
  };

  const wrapper = mount(component);

  click(wrapper.element.querySelector("#btn-stop"));
  click(wrapper.element.querySelector("#btn-prevent"));
  wrapper.componentVM.$nextTick(() => {
    expect(wrapper.element.querySelector("span").textContent).toBe("true true");
    done();
  });
});

test("v-stream directive (multiple bindings on same node)", (done) => {
  const component = {
    template: `
      <div>
        <span class="count">{{ count }}</span>
        <button
          v-stream:click="{ subject: plus$, data: 1 }"
          v-stream:keyup="{ subject: plus$, data: -1 }">+</button>
      </div>
    `,
    domStreams: ["plus$"],
    subscriptions() {
      return {
        count: this.plus$.pipe(
          pluck("data"),
          startWith(0),
          scan((total, change) => total + change)
        ),
      };
    },
  };

  const wrapper = mount(component);

  expect(wrapper.element.querySelector("span").textContent).toBe("0");
  click(wrapper.element.querySelector("button"));
  wrapper.componentVM.$nextTick(() => {
    expect(wrapper.element.querySelector("span").textContent).toBe("1");
    trigger(wrapper.element.querySelector("button"), "keyup");
    wrapper.componentVM.$nextTick(() => {
      expect(wrapper.element.querySelector("span").textContent).toBe("0");
      done();
    });
  });
});

test("$fromDOMEvent()", (done) => {
  const component = {
    template: `
      <div>
        <span class="count">{{ count }}</span>
        <button>+</button>
      </div>
    `,
    subscriptions() {
      const click$ = this.$fromDOMEvent("button", "click");
      return {
        count: click$.pipe(
          map(() => 1),
          startWith(0),
          scan((total, change) => total + change)
        ),
      };
    },
  };
  const wrapper = mount(component);

  document.body.appendChild(wrapper.element);
  expect(wrapper.element.querySelector("span").textContent).toBe("0");
  click(wrapper.element.querySelector("button"));
  wrapper.componentVM.$nextTick(() => {
    expect(wrapper.element.querySelector("span").textContent).toBe("1");
    done();
  });
});

test("$subscribeTo()", () => {
  const { ob, next } = mock();
  const results = [];
  const component = {
    template: defaultTemplate,
    created() {
      this.$subscribeTo(ob, (count) => {
        results.push(count);
      });
    },
  };

  const wrapper = mount(component);

  next(1);
  expect(results).toEqual([1]);

  wrapper.unmount();
  next(2);
  expect(results).toEqual([1]); // should not trigger anymore
});

test("$createObservableMethod() with no context", (done) => {
  const { ob, next } = mock();
  const results = [];
  const component = {
    template: defaultTemplate,
    created() {
      this.$createObservableMethod("add").subscribe(function (param) {
        expect(param).toEqual("hola");
        done();
      });
    },
  };

  const wrapper = mount(component);

  wrapper.componentVM.$nextTick(() => {
    wrapper.componentVM.add("hola");
  });
});

test("$createObservableMethod() with multi params & context", (done) => {
  const { ob, next } = mock();
  const results = [];
  var wrapper = { e: "" };
  const component = {
    template: defaultTemplate,
    created() {
      this.$createObservableMethod("add", true).subscribe(function (param) {
        expect(param[0]).toEqual("hola");
        expect(param[1]).toEqual("mundo");
        expect(param[2]).toEqual(wrapper.componentVM);
        done();
      });
    },
  };

  wrapper = mount(component);

  wrapper.componentVM.$nextTick(() => {
    wrapper.componentVM.add("hola", "mundo");
  });
});

test("observableMethods mixin", (done) => {
  const { ob, next } = mock();
  const results = [];
  const component = {
    template: defaultTemplate,
    observableMethods: ["add"],
    created() {
      this.add$.subscribe(function (param) {
        expect(param[0]).toEqual("Qué");
        expect(param[1]).toEqual("tal");
        done();
      });
    },
  };

  const wrapper = mount(component);

  wrapper.componentVM.$nextTick(() => {
    wrapper.componentVM.add("Qué", "tal");
  });
});

test("observableMethods mixin", (done) => {
  const { ob, next } = mock();
  const results = [];
  const component = {
    template: defaultTemplate,
    observableMethods: { add: "plus$" },
    created() {
      this.plus$.subscribe(function (param) {
        expect(param[0]).toEqual("Qué");
        expect(param[1]).toEqual("tal");
        done();
      });
    },
  };

  const wrapper = mount(component);

  wrapper.componentVM.$nextTick(() => {
    wrapper.componentVM.add("Qué", "tal");
  });
});
