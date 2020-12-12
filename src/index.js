import { ref } from "./methods/ref";
import { watch } from "./methods/watch";

console.log("link success");
export default {
  install: (app, options) => {
    // Plugin code goes here
    console.log("hello install");

    console.log(app);

    console.warn("--------------------------------------");

    console.log(options);
  },
};

export { ref, watch };
