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

<!--
  Outer is 160vh so sticky has 60vh of hold at viewport center before releasing.
  Content animates in while rising from below, holds at center, fades out before sticky releases.
-->
<div class="text-pause-outer" id="section-b" bind:this={outerEl}>
  <div
    class="text-pause-sticky"
    style={exitOpacity !== null ? `opacity: ${exitOpacity}` : ''}
  >
    <div class="section__inner">
      <div class="entry" class:visible={isVisible}>
        <h2 class="section-title">Why are so many young girls falling through the cracks?</h2>
        <p class="body-lg">Let's take a look at the screening data</p>

        <div class="arrow-wrap" aria-hidden="true">
          <img class="arrow-icon" src="/icons/arrow-icon.svg" alt="" />
        </div>
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

  .entry {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-title-body);
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }

  .entry.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .arrow-wrap {
    margin-top: 40px;
  }

  .arrow-icon {
    width: 32px;
    height: auto;
    display: block;
    animation: floatDown 1.5s ease-in-out infinite;
  }

  @keyframes floatDown {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(10px); }
  }

</style>
