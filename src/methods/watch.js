import { watch as _watch, onBeforeUnmount } from "vue";
import { Subject } from "rxjs";

export function watch(ref, fn = null) {
  const subject = new Subject();
  const $watch = _watch(ref, (val) => {
    subject.next(val);
    if (fn) fn(val);
  });
  $watch.next = subject.next.bind(subject);
  $watch.pipe = subject.pipe.bind(subject);
  $watch.subscribe = subject.subscribe.bind(subject);
  onBeforeUnmount(() => subject.unsubscribe());

  return $watch;
}
