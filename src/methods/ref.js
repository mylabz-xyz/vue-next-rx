import { ref as _ref, watch as _watch, onBeforeUnmount } from "vue";
import { Subject } from "rxjs";

export function ref(value) {
  const $ref = _ref(value);
  const subject = new Subject();
  $ref.next = subject.next.bind(subject);
  $ref.pipe = subject.pipe.bind(subject);
  $ref.subscribe = subject.subscribe.bind(subject);
  _watch($ref, (newValue) => {
    subject.next(newValue);
    console.log("update");
  });
  onBeforeUnmount(() => subject.unsubscribe());
  return $ref;
}
