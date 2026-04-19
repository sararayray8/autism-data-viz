<script>
  import { onMount } from 'svelte';

  let { steps = [], chart, text, exitInstant = false, activeStep = $bindable(0) } = $props();
  let exitHidden = $state(false);
  let outerEl;
  let rafId = null;

  onMount(() => {
    const getProgress = () => {
      if (!outerEl) return 0;
      const rect  = outerEl.getBoundingClientRect();
      const total = outerEl.offsetHeight - window.innerHeight;
      if (total <= 0) return 0;
      return -rect.top / total;
    };

    const rawProgress = getProgress();
    const clampedInit = Math.max(0, Math.min(1, rawProgress));
    activeStep = Math.min(steps.length - 1, Math.floor(clampedInit * steps.length));
    if (exitInstant) exitHidden = rawProgress >= 1;

    const handleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const raw = getProgress();
        const clamped = Math.max(0, Math.min(1, raw));
        const newStep = Math.min(steps.length - 1, Math.floor(clamped * steps.length));
        if (newStep !== activeStep) activeStep = newStep;
        if (exitInstant) exitHidden = raw >= 1;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  });
</script>

<div class="scrolly-outer" style="--num-steps: {steps.length}" bind:this={outerEl}>
  <div class="scrolly-sticky" style={exitHidden ? 'opacity: 0; pointer-events: none;' : ''}>
    <div class="scrolly-chart">
      {@render chart(activeStep)}
    </div>
    <div class="scrolly-text-panel">
      {@render text(activeStep, steps[activeStep])}
    </div>
  </div>
</div>

<style>
  .scrolly-outer {
    position: relative;
    height: calc(var(--num-steps, 3) * 100vh);
  }

  .scrolly-sticky {
    position: sticky;
    top: 0;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 40px;
    padding-inline: var(--margin-outer);
    text-align: center;
  }

  .scrolly-chart {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .scrolly-text-panel {
    width: 100%;
  }
</style>
