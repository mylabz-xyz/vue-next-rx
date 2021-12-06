import { uuidv4, warn } from "./util";
import { Subject, Subscription, isObservable } from "rxjs";
import { getCurrentInstance } from "vue";

export default {
  created() {
    var vm = this;
    const domStreams = vm.$options.domStreams;

    if (domStreams) {
      domStreams.forEach((key) => {
        vm[key] = new Subject();
      });
    }

    const observableMethods = vm.$options.observableMethods;
    if (observableMethods) {
      if (Array.isArray(observableMethods)) {
        observableMethods.forEach((methodName) => {
          vm[methodName + "$"] = vm.$createObservableMethod(methodName);
        });
      } else {
        Object.keys(observableMethods).forEach((methodName) => {
          vm[observableMethods[methodName]] =
            vm.$createObservableMethod(methodName);
        });
      }
    }

    let obs = vm.$options.subscriptions;
    if (typeof obs === "function") {
      obs = obs.call(vm);
    }
    if (obs) {
      vm.$observables = {};
      vm._subscription = new Subscription();
      Object.keys(obs).forEach((key) => {
        vm[key] = undefined;
        const ob = (vm.$observables[key] = obs[key]);
        if (!isObservable(ob)) {
          warn(
            'Invalid Observable found in subscriptions option with key "' +
              key +
              '".',
            vm
          );
          return;
        }
        vm._subscription.add(
          obs[key].subscribe(
            (value) => {
              vm[key] = value;
              try {
                vm.$forceUpdate();
              } catch (e) {
                const currentInst = getCurrentInstance();
                const newKey = uuidv4();
                // try to force new key if force update fails (usually fails when it is created on created hook)
                if (currentInst && currentInst.vnode) {
                  currentInst.vnode.key = newKey;
                } else if (vm.$ && vm.$.subTree) {
                  vm.$.subTree.key = newKey;
                } else if (currentInst && currentInst.subTree) {
                  currentInst.subTree.key = newKey;
                }
              }
            },
            (error) => {
              throw error;
            }
          )
        );
      });
    }
  },

  beforeUnmount() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  },
};
