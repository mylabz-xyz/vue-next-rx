# vue-next-rx

# 🚧🚧🚧 WORK IN PROGRESS 🚧🚧🚧

![](https://media.giphy.com/media/25JgMcsSndyuBkoaV2/giphy.gif)

[RxJS v6](https://github.com/ReactiveX/rxjs) integration for Vue next

> **NOTE**
>
> - vue-next-rx only works with RxJS v6+ by default. If you want to keep using RxJS v5 style code, install `rxjs-comat`.

#

### Installation

#### NPM + ES2015

**`rxjs` is required as a peer dependency.**

```bash
npm install vue @nopr3d/rx-vue-next rxjs --save
```

```js
import Vue from "vue";
import VueRx from "@nopr3d/rx-vue-next";

Vue.use(VueRx);
```

When bundling via webpack, `dist/vue-next-rx.esm.js` is used by default. It imports the minimal amount of Rx operators and ensures small bundle sizes.
