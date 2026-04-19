<script>
  import { onMount } from 'svelte';

  const questions = [
    { label: 'A1',  text: 'Does your child look at you when you call his/her name?' },
    { label: 'A2',  text: 'How easy is it for you to get eye contact with your child?' },
    { label: 'A3',  text: 'Does your child point to indicate that they want something (e.g., a toy out of reach)?' },
    { label: 'A4',  text: 'Does your child point to share interest with you (e.g., pointing at an interesting sight)?' },
    { label: 'A5',  text: 'Does your child pretend (e.g., care for dolls, talk on a toy phone)?' },
    { label: 'A6',  text: 'Does your child follow where you\'re looking?' },
    { label: 'A7',  text: 'If you or someone else in the family is visibly upset, does your child show signs of wanting to comfort them?' },
    { label: 'A8',  text: 'Would you describe your child\'s first words as typical, slightly unusual, or very unusual?' },
    { label: 'A9',  text: 'Does your child use simple gestures? (e.g. wave goodbye)' },
    { label: 'A10', text: 'Does your child stare at nothing with no apparent purpose?' }
  ];

  let isVisible  = $state(false); // intro text entry
  let numVisible = $state(0);     // how many questions are revealed (0–10)
  let fadeOpacity = $state(null); // all-at-once fade after all 10 appear
  let outerEl;
  let rafId = null;

  // Scroll thresholds (as fraction of hold distance)
  const REVEAL_END  = 0.72; // all 10 questions visible by 72% of hold
  const FADE_START  = 0.85; // simultaneous fade-out starts at 85%

  onMount(() => {
    const tick = () => {
      if (!outerEl) return;
      const rect = outerEl.getBoundingClientRect();
      const vh = window.innerHeight;
      const holdDist = outerEl.offsetHeight - vh;

      // Entry: fire as section enters viewport so intro text animates in while rising
      if (rect.top <= vh && !isVisible) isVisible = true;
      if (rect.top > vh && isVisible)  isVisible = false;

      // Before sticky engages — no questions yet
      if (rect.top > 0) {
        numVisible  = 0;
        fadeOpacity = null;
        return;
      }

      const progress = Math.min(1, -rect.top / holdDist);

      // Questions reveal one-by-one across the first REVEAL_END of hold
      numVisible = Math.min(10, Math.floor((progress / REVEAL_END) * 10) + 1);

      // All questions fade out simultaneously after FADE_START
      if (progress >= FADE_START) {
        const t = Math.min(1, (progress - FADE_START) / (1 - FADE_START));
        fadeOpacity = Math.max(0, parseFloat((1 - t).toFixed(3)));
      } else {
        fadeOpacity = null;
      }
    };

    const handleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => { rafId = null; tick(); });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    tick();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  });
</script>

<!--
  250vh outer → 150vh hold.
  Intro text fades in on entry. Questions appear one-by-one as you scroll (scroll-driven).
  All 10 fade out together at 85% of hold, then section scrolls away.
-->
<div class="h-outer" id="section-h" bind:this={outerEl}>
  <div
    class="h-sticky"
    style={fadeOpacity !== null ? `opacity: ${fadeOpacity}` : ''}
  >
    <div class="section__inner">

      <p class="section-title intro entry" class:visible={isVisible}>
        To understand how these differences appear, let's look at responses to the A1–A10 screening questions:
      </p>

      <ul class="question-list">
        {#each questions as q, i}
          <li class="question-item" class:visible={i < numVisible}>
            <span class="q-label">{q.label}</span>
            <span class="q-text">{q.text}</span>
          </li>
        {/each}
      </ul>

    </div>
  </div>
</div>

<style>
  .h-outer {
    position: relative;
    height: 250vh;
  }

  .h-sticky {
    position: sticky;
    top: 0;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .section__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    width: 100%;
    padding-inline: var(--margin-outer);
  }

  .intro {
    max-width: 640px;
  }

  /* Intro text entry animation */
  .entry {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .entry.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .question-list {
    list-style: none;
    width: 100%;
    max-width: 680px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    text-align: left;
  }

  /* Questions start hidden; each appears when scroll reaches its threshold */
  .question-item {
    display: flex;
    gap: 16px;
    align-items: flex-start;
    opacity: 0;
    transform: translateY(6px);
    transition: opacity 0.35s ease, transform 0.35s ease;
  }

  .question-item.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .q-label {
    font-family: var(--font-headline);
    font-size: 15px;
    font-weight: var(--weight-semibold);
    color: var(--color-text);
    min-width: 36px;
    flex-shrink: 0;
  }

  .q-text {
    font-family: var(--font-body);
    font-size: 15px;
    color: var(--color-text);
    line-height: 1.4;
  }
</style>
