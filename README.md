# vue-next-rx

<div align="center">
<img src="https://i.ibb.co/q5267TX/maxresdefault-2.jpg" width="25%" />
</div>

### [RxJS v7](https://github.com/ReactiveX/rxjs) integration for [Vue next]()

</br>

![](https://img.shields.io/github/license/NOPR9D/vue-next-rx)
![](https://gitlab.com/nopr3d/vue-next-rx/badges/main/pipeline.svg)

<br>


# Update 1.0.9
- Now using Rxjs v7
- Fix undefined in case of created hook

---
<br/>
---

> **NOTE**
>
> - vue-next-rx only works with RxJS v6+ by default. If you want to keep using RxJS v5 style code, install `rxjs-compat`.

---

# Installation

#### NPM + ES2015 or more

**`rxjs` is required as a peer dependency.**

```bash
npm install vue @nopr3d/vue-next-rx rxjs --save
```

```js
import Vue from "vue";
import VueRx from "@nopr3d/vue-next-rx";

Vue.use(VueRx);
```

<br />

When bundling via webpack, `dist/vue-next-rx.esm.js` is used by default. It imports the minimal amount of Rx operators and ensures small bundle sizes.

To use in a browser environment, use the UMD build `dist/vue-next-rx.js`. When in a browser environment, the UMD build assumes `window.rxjs` to be already present, so make sure to include `vue-next-rx.js` after Vue.js and RxJS. It also installs itself automatically if `window.Vue` is present.

Example:

```html
<script src="https://unpkg.com/rxjs@^7/dist/bundles/rxjs.umd.min.js"></script>
<script src="https://unpkg.com/vue@next"></script>
<script src="../dist/vue-next-rx.js"></script>
```

<br />

---

# Usage

<br />

# Subscriptions

```js
// Expose `Subject` with domStream, use them in subscriptions functions
export default defineComponent({
  name: "Home",
   domStreams: ["click$"],
    subscriptions() {
      return {
        count: this.click$.pipe(
          map(() => 1),
          startWith(0),
          scan((total, change) => total + change)
        ),
      };
});
```

```html
<div>
  <button v-stream:click="click$">Click Me</button>
</div>

<div>{{count}}</div>
<!-- On click will show 0, 1 ,2 ,3... -->
```

### Or

</br>

```js
// Expose `Subject` with domStream, use them in subscriptions functions
export default defineComponent({
  name: "Home",
  domStreams: ["action$"],
  subscriptions() {
    this.action$.pipe(map(() => "Click Event !")).subscribe(console.log);
    // On click will print "Click Event"
  },
});
```

## Tips

You can get the data by simply plucking it from the source stream:

```js
const actionData$ = this.action$.pipe(pluck("data"));
```

You can bind Subject by this way

```html // Bind with stream directives
<button v-stream:click="action$">Click Me!</button>
or
<button v-stream:click="{ subject: action$, data: someData }">+</button>
```

</br>

---

# Ref

```js
import { ref } from "@nopr3d/vue-next-rx";

// use ref like an Rx Subject
export default defineComponent({
  name: "Home",
  components: {},
  setup() {
    const msg = ref("Message exemple");

    setTimeout(() => {
      msg.value = "New message !";
    }, 2000);

    msg.subscribe((value) => {
      console.log(value); // After 2s will print : New message !
    });

    return { msg };
  },
});
```

```html
<!-- bind to it normally in templates -->
<!-- on change DOM is update too -->
<div>{{ msg }}</div>
```

---

<br />

# Watch

```js
import { ref, watch } from "@nopr3d/vue-next-rx";

export default defineComponent({
  name: "Home",
  components: {},
  setup() {
    const msg = ref("Message exemple");

    watch(msg).subscribe((val) => {
      console.log(val); // After 2s will print : New message !
    });

    setTimeout(() => {
      msg.value = "New message !";
    }, 2000);

    return { msg };
  },
});
```

```html
<!-- bind to it normally in templates -->
<!-- on change DOM is update too -->
<div>{{ msg }}</div>
```

---

<br />

# Other API Methods

</br>

## `$watchAsObservable(expOrFn, [options])`

This is a prototype method added to instances. You can use it to create an observable from a Data. The emitted value is in the format of `{ newValue, oldValue }`:

```js
import { ref } from "@nopr3d/vue-next-rx";

export default defineComponent({
  name: "Home",
  setup() {
    const msg = ref("Old Message");
    setTimeout(() => (msg.value = "New message incomming !"), 1000);
    return { msg };
  },
  subscriptions() {
    return {
      oldMsg: this.$watchAsObservable("msg").pipe(pluck("oldValue")),
    };
  },
});
```

```html
<!-- bind to it normally in templates -->
<!-- on change DOM is update too -->
<div>{{ msg }}</div>
<!-- Will display : Old message, after 1 second display "New Message !" -->
<div>{{oldMsg}}</div>
<!-- wait for value and display "Old Message" after 1 second -->
```

---

## `$subscribeTo(observable, next, error, complete)`

This is a prototype method added to instances. You can use it to subscribe to an observable, but let VueRx manage the dispose/unsubscribe.

```js
import { interval } from "rxjs";

const vm = new Vue({
  mounted() {
    this.$subscribeTo(interval(1000), function (count) {
      console.log(count);
    });
  },
});
```

## `$fromDOMEvent(selector, event)`

This is a prototype method added to instances. Use it to create an observable from DOM events within the instances' element. This is similar to `Rx.Observable.fromEvent`, but usable inside the `subscriptions` function even before the DOM is actually rendered.

`selector` is for finding descendant nodes under the component root element, if you want to listen to events from root element itself, pass `null` as first argument.

```js
import { pluck } from "rxjs/operators";

const vm = new Vue({
  subscriptions() {
    return {
      inputValue: this.$fromDOMEvent("input", "keyup").pipe(
        pluck("target", "value")
      ),
    };
  },
});
```

```html
<div><input /></div>
<div>{{inputValue}}</div>
```

---

## `$createObservableMethod(methodName)`

Convert function calls to observable sequence which emits the call arguments.

This is a prototype method added to instances. Use it to create a shared hot observable from a function name. The function will be assigned as a vm method.

```html
<custom-form :onSubmit="submitHandler"></custom-form>
```

```js
const vm = new Vue({
  subscriptions() {
    return {
      // requires `share` operator
      formData: this.$createObservableMethod("submitHandler"),
    };
  },
});
```

You can use the `observableMethods` option to make it more declarative:

```js
new Vue({
  observableMethods: {
    submitHandler: "submitHandler$",
    // or with Array shothand: ['submitHandler']
  },
});
```

The above will automatically create two things on the instance:

1. A `submitHandler` method which can be bound to in template with `v-on`;
2. A `submitHandler$` observable which will be the stream emitting calls to `submitHandler`.

[example](https://github.com/NOPR9D/vue-next-rx/blob/main/example/createObservableMethod.html)

---

## Example

See `/examples` for some simple examples.

</br>

---

## Test

Test look goods, feel free to open an issue !

![](https://i.ibb.co/17mtk34/testsPNG.png)

---

### Contributors

<div align="center" style="display:flex;" >
<div  style="display:flex; flex-direction:row;align-items:center;width:50%;">
<a href="https://github.com/NOPR9D">
<img style="border-radius:100px; margin:auto;" src="https://avatars.githubusercontent.com/u/75882457?v=4" width="75px" />
<div>NOPR9D</div></a>
</div>
<div style="display:flex; flex-direction:row;align-items:center; width:50%;" >
<a href="https://github.com/AlvinTCH">
<img style="border-radius:100px; margin:auto;" src="https://avatars.githubusercontent.com/u/48837852?v=4" width="75px" />
<div>AlvinTCH</div>
</a>
</div>
</div>

---

## License

[MIT](http://opensource.org/licenses/MIT)

---
