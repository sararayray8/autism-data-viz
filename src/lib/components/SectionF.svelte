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

<div class="text-pause-outer" id="section-f" bind:this={outerEl}>
  <div
    class="text-pause-sticky"
    style={exitOpacity !== null ? `opacity: ${exitOpacity}` : ''}
  >
    <div class="section__inner content-col">

      <div class="text-block entry" class:visible={isVisible}>
        <p class="section-title">
          Masking can make autism in girls more difficult to detect, often delaying diagnosis.
        </p>
        <p class="body-lg">
          A delayed diagnosis can postpone access to appropriate support, interventions, and resources.
        </p>
        <p class="citation">Belcher et. al, 2022</p>
      </div>

      <div class="avatar-wrap entry-delayed" class:visible={isVisible}>
        <img
          class="masking-avatar"
          src="/masking/masking-avatar.svg"
          alt="Illustration of a girl masking"
        />
      </div>

    </div>
  </div>
</div>

<style>
  .text-pause-outer {
    position: relative;
    height: 180vh;
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

  .text-block {
    display: flex;
    flex-direction: column;
    gap: var(--gap-title-body);
    max-width: 640px;
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

  .entry-delayed {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease 0.35s, transform 0.6s ease 0.35s;
  }

  .entry-delayed.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .citation {
    font-family: var(--font-body);
    font-size: var(--size-caption);
    color: var(--color-muted);
    opacity: 0.7;
  }

  .masking-avatar {
    width: 170px;
    height: auto;
    display: block;
  }

</style>
