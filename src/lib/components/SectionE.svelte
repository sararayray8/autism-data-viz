<script>
  import { onMount } from 'svelte';
  import { makeTextPause } from '$lib/utils/scrollText.js';

  let outerEl;
  let isVisible = $state(false);
  let isSvgVisible = $state(false);
  let exitOpacity = $state(null);

  onMount(() => {
    const cleanupPause = makeTextPause(outerEl, (v) => (isVisible = v), (o) => (exitOpacity = o));

    // SVG appears once the hold phase is 30% through — after the text animation settles.
    // Hold distance = 200vh - 100vh = 100vh.
    const trackProgress = () => {
      if (!outerEl) return;
      const rect = outerEl.getBoundingClientRect();
      const holdDist = outerEl.offsetHeight - window.innerHeight;
      if (rect.top <= 0 && holdDist > 0) {
        isSvgVisible = (-rect.top / holdDist) >= 0.3;
      } else {
        isSvgVisible = false;
      }
    };

    window.addEventListener('scroll', trackProgress, { passive: true });
    trackProgress();

    return () => {
      cleanupPause();
      window.removeEventListener('scroll', trackProgress);
    };
  });
</script>

<!--
  200vh gives 100vh hold.
  Text animates in on entry. Masking SVG appears at 30% through the hold
  (scroll-driven, so it always arrives after the text has settled).
-->
<div class="text-pause-outer" id="section-e" bind:this={outerEl}>
  <div
    class="text-pause-sticky"
    style={exitOpacity !== null ? `opacity: ${exitOpacity}` : ''}
  >
    <div class="section__inner content-col">

      <p class="headline entry" class:visible={isVisible}>
        In response to these social pressures, women with autism often engage in masking.
      </p>

      <div class="definition-wrap svg-entry" class:visible={isSvgVisible}>
        <img
          class="definition-img"
          src="/masking/masking-definition.svg"
          alt="Definition of masking"
        />
      </div>

    </div>
  </div>
</div>

<style>
  .text-pause-outer {
    position: relative;
    height: 200vh;
  }

  .text-pause-sticky {
    position: sticky;
    top: 0;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .content-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 48px;
  }

  .entry {
    max-width: 680px;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }

  .entry.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* SVG reveal — no delay, scroll position handles timing */
  .svg-entry {
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }

  .svg-entry.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .definition-img {
    width: min(560px, 90vw);
    height: auto;
    display: block;
  }
</style>
