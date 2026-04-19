<script>
  let { activeStep } = $props();

  const srcs = [
    '/charts/sunburst-1.svg',
    '/charts/sunburst-2.svg',
    '/charts/sunburst-3.svg',
    '/charts/sunburst-4.svg',
    '/charts/sunburst-5.svg',
  ];

  let growingIndex = $state(-1);
  let prevActiveStep = activeStep;

  $effect(() => {
    const cur = activeStep;
    const prev = prevActiveStep;
    prevActiveStep = cur;

    if ((cur === 1 && prev === 0) || (cur === 2 && prev === 1)) {
      // Remove class first so animation restarts cleanly from `from` keyframe
      growingIndex = -1;
      requestAnimationFrame(() => { growingIndex = cur; });
    } else if (cur !== 1 && cur !== 2) {
      growingIndex = -1;
    }
  });
</script>

<!--
  All 5 images live in the DOM from page load (eagerly loaded, absolutely stacked).
  Steps 0–1, 3–4: pure CSS opacity toggle — no flash.
  Step 2→3: outer ring grows from inner ring edge (clip-path circle 33%→50%).
-->
<div class="sunburst-wrap">
  {#each srcs as src, i}
    <img
      class="sunburst-img"
      class:active={i === activeStep}
      class:grow-in={i === growingIndex}
      {src}
      loading="eager"
      alt="Sunburst chart — step {i}"
    />
  {/each}
</div>

<style>
  .sunburst-wrap {
    position: relative;
    width: min(420px, 80vw);
    height: min(420px, 80vw);
    flex-shrink: 0;
  }

  .sunburst-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
    opacity: 0;
    transition: opacity 0.35s ease-in-out;
  }

  .sunburst-img.active {
    opacity: 1;
  }

  /* Step 2→3: appear instantly (no fade) and expand outer ring outward */
  .sunburst-img.grow-in {
    opacity: 1;
    transition: opacity 0s;
    animation: grow-outer-ring 0.65s ease-out forwards;
  }

  @keyframes grow-outer-ring {
    from { clip-path: circle(33% at 50% 50%); }
    to   { clip-path: circle(50% at 50% 50%); }
  }

  @media (max-width: 767px) {
    .sunburst-wrap {
      width: min(340px, 90vw);
      height: min(340px, 90vw);
    }
  }
</style>
