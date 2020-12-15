const alias = require("@rollup/plugin-alias");
const buble = require("@rollup/plugin-buble");

module.exports = [
  {
    input: "src/index.js",
    output: {
      file: "dist/rx-vue-next.esm.js",
      exports: "named",
      format: "es",
      globals: {
        vue: "Vue",
        rxjs: "rxjs",
        "rxjs/operators": "rxjs/operators",
      },
    },
    plugins: [
      buble(),
      alias({
        "rxjs/operators": "src/umd-aliases/operators.js",
        rxjs: "src/umd-aliases/rxjs.js",
      }),
    ],
    external: ["vue", "rxjs", "rxjs/operators"],
  },
  {
    input: "src/index.js",
    output: {
      file: "dist/rx-vue-next.js",
      format: "umd",
      exports: "named",
      name: "VueNextRx",
      globals: {
        vue: "Vue",
        rxjs: "rxjs",
        "rxjs/operators": "rxjs/  operators",
      },
    },
    plugins: [
      buble(),
      alias({
        "rxjs/operators": "src/umd-aliases/operators.js",
        rxjs: "src/umd-aliases/rxjs.js",
      }),
    ],
    external: ["vue", "rxjs", "rxjs/operators"],
  },
];
