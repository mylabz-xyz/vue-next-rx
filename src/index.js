console.log("link success");
export default {
  install: (app, options) => {
    // Plugin code goes here
    console.log("hello install");

    console.log(app);

    console.warn("--------------------------------------");

    console.log(options);
  }
};
