import { watchEffect as _watchEffect, onBeforeUnmount } from "vue";
import { BehaviorSubject } from "rxjs";

export default function watchEffect(ref, fn = null) {
  const subject = new BehaviorSubject();
  const $watchEffect = _watchEffect(ref, (val) => {
    subject.next(val);
    if (fn) fn(val);
  });
  $watchEffect.next = subject.next.bind(subject);
  $watchEffect.pipe = subject.pipe.bind(subject);
  $watchEffect.subscribe = subject.subscribe.bind(subject);
  onBeforeUnmount(() => subject.unsubscribe());

  return $watchEffect;
}
