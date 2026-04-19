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

<div class="text-pause-outer" id="section-d" bind:this={outerEl}>
  <div
    class="text-pause-sticky"
    style={exitOpacity !== null ? `opacity: ${exitOpacity}` : ''}
  >
    <div class="section__inner">
      <div class="text-block entry" class:visible={isVisible}>
        <p class="section-title">
          Females are often expected to be more socially engaged than males, especially in complex social environments.
        </p>
        <p class="body-lg">
          These social pressures can add to the already existing challenges experienced by autistic women.
        </p>
        <p class="citation">Corscadden et. al, 2021</p>
      </div>
    </div>
  </div>
</div>

<style>
  .text-pause-outer {
    position: relative;
    height: 160vh;
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

  .text-block {
    display: flex;
    flex-direction: column;
    gap: var(--gap-title-body);
    max-width: 680px;
    margin-inline: auto;
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

  .citation {
    font-family: var(--font-body);
    font-size: var(--size-caption);
    color: var(--color-muted);
    opacity: 0.7;
  }

</style>
