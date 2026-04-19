/**
 * Watches step sentinel elements. Fires onStep(index) when a sentinel
 * crosses the viewport midpoint (rootMargin crops top+bottom 45%).
 * Returns a cleanup function — return it from onMount.
 */
export function makeStepObserver(elements, onStep) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onStep(Number(entry.target.dataset.step));
        }
      });
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
  );

  elements.forEach((el) => el && io.observe(el));
  return () => io.disconnect();
}

/**
 * Single-fire observer — calls onEnter once when element enters view
 * then immediately disconnects. Used for section entry animations.
 */
export function makeEntryObserver(element, onEnter, threshold = 0.25) {
  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        onEnter();
        io.disconnect();
      }
    },
    { threshold }
  );
  io.observe(element);
  return () => io.disconnect();
}
