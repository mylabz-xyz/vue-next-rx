import { Subscription } from "rxjs";

export function subscribeTo(observable, ...subscribeArgs) {
  const subscription = observable.subscribe(...subscribeArgs);
  (this._subscription || (this._subscription = new Subscription())).add(
    subscription
  );
  return subscription;
}
