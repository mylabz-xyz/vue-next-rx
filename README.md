# vue-next-rx

<div align="center">
<img src="assets/pictures/vue-rx.jpg" width="25%" />
</div>

### [RxJS v6](https://github.com/ReactiveX/rxjs) integration for [Vue next]()

</br>

# 🚧🚧🚧 WORK IN PROGRESS 🚧🚧🚧

![](https://media.giphy.com/media/25JgMcsSndyuBkoaV2/giphy.gif)

<br>

> **NOTE**
>
> - vue-next-rx only works with RxJS v6+ by default. If you want to keep using RxJS v5 style code, install `rxjs-comat`.

---

### Installation

#### NPM + ES2015 or more

**`rxjs` is required as a peer dependency.**

```bash
npm install vue @nopr3d/rx-vue-next rxjs --save
```

```js
import Vue from "vue";
import VueRx from "@nopr3d/rx-vue-next";

Vue.use(VueRx);
```

<br />

When bundling via webpack, `dist/vue-next-rx.esm.js` is used by default. It imports the minimal amount of Rx operators and ensures small bundle sizes.

To use in a browser environment, use the UMD build `dist/vue-next-rx.js`. When in a browser environment, the UMD build assumes `window.rxjs` to be already present, so make sure to include `vue-next-rx.js` after Vue.js and RxJS. It also installs itself automatically if `window.Vue` is present.

Example:

```html
<script src="https://unpkg.com/rxjs/bundles/rxjs.umd.js"></script>
<script src="https://unpkg.com/vue@next"></script>
<script src="../dist/vue-next-rx.js"></script>
```

<br />

---

## Usage

<br />

### Subscription

```js
import { ref } from "@nopr3d/rx-vue-next";

// provide Rx observables with the `subscriptions` option
export default defineComponent({
    name: "Home",
    subscriptions() {
           msg: messageObservable
    },,
});
```

---

```html
<!-- bind to it normally in templates -->
<div>{{ msg }}</div>
```

### Ref

```js
import { ref } from "@nopr3d/rx-vue-next";

// use ref like an Rx Subject
export default defineComponent({
  name: "Home",
  components: {},
  setup() {
    const msg = ref("Message exemple");

    msg.value = "New message !";

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

### Watch

```js
import { ref, watch } from "@nopr3d/rx-vue-next";

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

### Watch

```js
import { ref, watch } from "@nopr3d/rx-vue-next";

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
