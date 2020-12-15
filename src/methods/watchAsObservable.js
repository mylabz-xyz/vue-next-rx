import { Observable, Subscription } from "rxjs";

export function watchAsObservable(expOrFn, options) {
  const vm = this;
  const obs$ = new Observable((observer) => {
    let _unwatch;
    const watch = () => {
      vm.$watch(
        expOrFn,
        (newValue, oldValue) => {
          observer.next({ oldValue: oldValue, newValue: newValue });
        },
        options
      );
    };

    // if $watchAsObservable is called inside the subscriptions function,
    // because data hasn't been observed yet, the watcher will not work.
    // in that case, wait until created hook to watch.
    setTimeout(() => {
      watch();
    }, 0);

    // Returns function which disconnects the $watch expression
    return new Subscription(() => {
      _unwatch && _unwatch();
    });
  });

  return obs$;
}
