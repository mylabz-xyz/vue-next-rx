const alias = require("@rollup/plugin-alias");
const buble = require("@rollup/plugin-buble");

module.exports = [
  {
    input: "src/index.js",
    output: {
      file: "dist/vue-next-rx.esm.js",
      exports: "named",
      format: "es",
      globals: {
        vue: "vue",
        rxjs: "rxjs",
        "rxjs/operators": "rxjs/operators",
      },
    },
    plugins: [buble()],
    external: ["rxjs", "rxjs/operators"],
  },
  {
    input: "src/index.js",
    output: {
      file: "dist/vue-next-rx.js",
      format: "umd",
      exports: "named",
      name: "VueNextRx",
      globals: {
        vue: "vue",
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
  },
];
