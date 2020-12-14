import { watchEffect as _watchEffect, onBeforeUnmount } from "vue";
import { BehaviorSubject } from "rxjs";

export function watchEffect(fn = null) {
  const subject = new BehaviorSubject(null);
  const $watchEffect = _watchEffect(() => {
    subject.next("null");
    console.log("hi");
    if (fn) fn();
  });
  $watchEffect.next = subject.next.bind(subject);
  $watchEffect.pipe = subject.pipe.bind(subject);
  $watchEffect.subscribe = subject.subscribe.bind(subject);
  $watchEffect.unsubscribe = () => {
    $watchEffect();
    subject.unsubscribe();
  };
  onBeforeUnmount(() => subject.unsubscribe());

  return $watchEffect;
}
