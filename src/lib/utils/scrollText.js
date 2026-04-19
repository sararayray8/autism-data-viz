/**
 * Text pause behavior — requires the outer element to be taller than 100vh.
 * The caller's HTML must follow this structure:
 *
 *   <div bind:this={outerEl} class="text-pause-outer">   <!-- height: Xvh -->
 *     <div class="text-pause-sticky" style={opacity}>    <!-- position:sticky, top:0, height:100vh -->
 *       <div class="section__inner">
 *         [content with .entry / .entry-delayed classes]
 *       </div>
 *     </div>
 *   </div>
 *
 * Timeline:
 *   - Entry fires as outer enters viewport so animation completes by the time
 *     content reaches viewport center (sticky engagement).
 *   - Hold: sticky keeps content at center for (outerHeight - 100vh) of scroll.
 *   - Exit: opacity fades from hold-progress 45% → 100% (no translateY).
 *   - Reset: when outer fully exits below viewport, state reverts for re-entry.
 */
export function makeTextPause(outerEl, setVisible, setExitOpacity) {
  let entered = false;

  const tick = () => {
    if (!outerEl) return;
    const rect = outerEl.getBoundingClientRect();
    const vh = window.innerHeight;
    const holdDist = outerEl.offsetHeight - vh; // scroll distance during sticky hold

    // Fully below viewport — reset for clean re-entry
    if (rect.top > vh) {
      if (entered) {
        entered = false;
        setVisible(false);
        setExitOpacity(null);
      }
      return;
    }

    // Entry: fire as outer enters viewport bottom so animation plays while rising to center
    if (!entered && rect.top <= vh) {
      entered = true;
      setVisible(true);
    }

    // Exit: fade during sticky hold phase (rect.top goes 0 → -holdDist)
    if (rect.top <= 0 && holdDist > 0) {
      const progress = Math.min(1, -rect.top / holdDist);
      if (progress > 0.45) {
        const t = (progress - 0.45) / 0.55;
        setExitOpacity(Math.max(0, parseFloat((1 - t).toFixed(3))));
      } else {
        setExitOpacity(null);
      }
    } else {
      setExitOpacity(null);
    }
  };

  window.addEventListener('scroll', tick, { passive: true });
  tick();
  return () => window.removeEventListener('scroll', tick);
}
