<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  const steps = [
    {
      icon: '/icons/heart-icon.svg',
      headline: 'Differences in how autism traits appear can lead to unequal detection and delayed access to support.'
    },
    {
      icon: '/icons/hand-heart-icon.svg',
      headline: '& recognizing how these traits present across genders is essential to ensure they get the help and care they need.'
    }
  ];

  let activeStep = $state(0);
  let outerEl;
  let rafId = null;

  onMount(() => {
    const calcStep = () => {
      if (!outerEl) return -1;
      const rect  = outerEl.getBoundingClientRect();
      const total = outerEl.offsetHeight - window.innerHeight;
      if (total <= 0) return 0;
      const progress = Math.max(0, Math.min(1, -rect.top / total));
      return progress >= 0.5 ? 1 : 0;
    };

    const initStep = calcStep();
    if (initStep >= 0) activeStep = initStep;

    // Block wheel + touch scroll for the duration of the first fade-in
    const FADE_DURATION = 650;
    let lockTimer = null;
    const noScroll = (e) => e.preventDefault();
    const lockScroll = () => {
      window.addEventListener('wheel',     noScroll, { passive: false });
      window.addEventListener('touchmove', noScroll, { passive: false });
      clearTimeout(lockTimer);
      lockTimer = setTimeout(() => {
        window.removeEventListener('wheel',     noScroll);
        window.removeEventListener('touchmove', noScroll);
      }, FADE_DURATION);
    };

    // Fire the lock exactly once, when the section first becomes sticky
    let prevTop = Infinity;
    let hasLocked = false;

    const handleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const newStep = calcStep();
        if (newStep >= 0 && newStep !== activeStep) activeStep = newStep;

        if (!outerEl) return;
        const top = outerEl.getBoundingClientRect().top;
        if (!hasLocked && prevTop > 0 && top <= 0) {
          hasLocked = true;
          lockScroll();
        }
        prevTop = top;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel',     noScroll);
      window.removeEventListener('touchmove', noScroll);
      clearTimeout(lockTimer);
      if (rafId) cancelAnimationFrame(rafId);
    };
  });
</script>

<div class="conclusion-outer" id="section-k" bind:this={outerEl}>
  <div class="conclusion-sticky">
    {#key activeStep}
      <div class="conclusion-panel" in:fade={{ duration: 300 }} out:fade={{ duration: 200 }}>
        <img
          class="conclusion-icon"
          src={steps[activeStep].icon}
          alt=""
          aria-hidden="true"
        />
        <p class="headline">{steps[activeStep].headline}</p>
      </div>
    {/key}
  </div>

</div>

<style>
  .conclusion-outer {
    position: relative;
    height: 200vh;
  }

  .conclusion-sticky {
    position: sticky;
    top: 0;
    height: 100vh;
    text-align: center;
  }

  /* Both outgoing and incoming panels are absolutely positioned so they
     overlay each other during the cross-fade — no layout shift. */
  .conclusion-panel {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 32px;
    padding-inline: 32px;
    max-width: 700px;
    margin-inline: auto;
  }

  .conclusion-icon {
    width: 72px;
    height: 72px;
    object-fit: contain;
    display: block;
  }

  .headline {
    font-family: var(--font-headline);
    font-size: var(--size-headline);
    font-weight: var(--weight-semibold);
    color: var(--color-text);
  }

</style>
