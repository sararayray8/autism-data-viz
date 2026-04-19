<script>
  import { onMount } from 'svelte';
  import { makeTextPause } from '$lib/utils/scrollText.js';

  let outerEl;
  let isVisible = $state(false);
  let exitOpacity = $state(null);

  onMount(() => {
    return makeTextPause(outerEl, (v) => (isVisible = v), (o) => (exitOpacity = o));
  });
</script>

<div class="text-pause-outer" id="section-g" bind:this={outerEl}>
  <div
    class="text-pause-sticky"
    style={exitOpacity !== null ? `opacity: ${exitOpacity}` : ''}
  >
    <div class="section__inner">
      <p class="headline entry" class:visible={isVisible}>
        So how do these differences show up across genders?
      </p>
    </div>
  </div>
</div>

<style>
  .text-pause-outer {
    position: relative;
    height: 150vh;
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

  .entry {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }

  .entry.visible {
    opacity: 1;
    transform: translateY(0);
  }

</style>
