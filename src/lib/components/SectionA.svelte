<script>
  import { onMount } from 'svelte';

  let activeStep = $state(0);
  let outerEl;

  onMount(() => {
    // Animation: 1.4s duration + 0.44s max stagger + 60ms buffer
    const ANIM_DURATION = 1900;
    const noScroll = (e) => e.preventDefault();
    let lockTimer = null;
    let hasLocked = false;

    const unlock = () => {
      window.removeEventListener('wheel',     noScroll);
      window.removeEventListener('touchmove', noScroll);
    };

    const handleScroll = () => {
      if (!outerEl) return;
      const rect = outerEl.getBoundingClientRect();
      const total = outerEl.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const progress = Math.max(0, Math.min(1, -rect.top / total));
      const newStep = progress >= 0.5 ? 1 : 0;

      if (newStep === 1 && !hasLocked) {
        hasLocked = true;
        window.addEventListener('wheel',     noScroll, { passive: false });
        window.addEventListener('touchmove', noScroll, { passive: false });
        lockTimer = setTimeout(unlock, ANIM_DURATION);
      }

      activeStep = newStep;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(lockTimer);
      unlock();
    };
  });
</script>

<div class="hero-outer" id="section-a" bind:this={outerEl}>
  <div class="hero-sticky">

    <p class="headline">
      75% of girls who screen positive for autism aren't identified until adolescence or adulthood.
    </p>

    <!--
      Avatars 1–3 each have a color + bw image stacked.
      On step 1, CSS animations sequence: color→bw crossfade → opacity 0 → width collapse.
      Avatar 4 (persistent) stays colored and naturally centers as siblings collapse.
      margin-right (not gap) is used so spacing collapses with each wrapper.
    -->
    <div class="avatar-row" class:step-1={activeStep === 1}>

      {#each [1, 2, 3] as n}
        <div class="avatar-wrap vanishing" style="--delay: {(n - 1) * 0.22}s">
          <img class="img-color" src="/avatars/Avatar-{n}.svg" alt="" />
          <img class="img-bw"    src="/avatars/Avatar-{n}-bw.svg" alt="" aria-hidden="true" />
        </div>
      {/each}

      <div class="avatar-wrap persistent">
        <img src="/avatars/Avatar-4.png" alt="One girl remains" />
      </div>

    </div>
  </div>
</div>

<style>
  .hero-outer {
    position: relative;
    height: 200vh;
  }

  .hero-sticky {
    position: sticky;
    top: 0;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 56px;
    padding-inline: var(--margin-outer);
    text-align: center;
  }

  .headline {
    font-family: var(--font-headline);
    font-size: var(--size-headline);
    font-weight: var(--weight-semibold);
    color: var(--color-text);
    max-width: 700px;
  }

  /* margin-right on wrappers so spacing collapses with each avatar */
  .avatar-row {
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }

  .avatar-wrap {
    --avatar-size: 170px;
    --avatar-gap: 28px;
    position: relative;
    width: var(--avatar-size);
    height: var(--avatar-size);
    flex-shrink: 0;
    overflow: hidden;
    margin-right: var(--avatar-gap);
  }

  .avatar-wrap:last-child { margin-right: 0; }

  /* Color + bw images stacked absolutely */
  .img-color,
  .img-bw {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .img-bw { opacity: 0; }

  /* Persistent avatar (4) — no bw, no collapse */
  .avatar-wrap.persistent {
    overflow: visible;
  }

  .avatar-wrap.persistent img {
    width: var(--avatar-size);
    height: var(--avatar-size);
    object-fit: contain;
    display: block;
  }

  /* ── Step 1 animations ────────────────────────────────────── */

  /* Color image fades out */
  .avatar-row.step-1 .vanishing .img-color {
    animation: colorOut 1.4s ease var(--delay) forwards;
  }

  /* BW image fades in then out (briefly shows the bw artwork) */
  .avatar-row.step-1 .vanishing .img-bw {
    animation: bwThrough 1.4s ease var(--delay) forwards;
  }

  /* Wrapper collapses width + margin so avatar 4 naturally centers */
  .avatar-row.step-1 .vanishing {
    animation: wrapCollapse 1.4s ease var(--delay) forwards;
  }

  @keyframes colorOut {
    0%, 28%   { opacity: 1; }
    55%, 100% { opacity: 0; }
  }

  @keyframes bwThrough {
    0%, 28%  { opacity: 0; }
    48%      { opacity: 1; }
    78%, 100% { opacity: 0; }
  }

  @keyframes wrapCollapse {
    0%, 50%  { width: var(--avatar-size); margin-right: var(--avatar-gap); }
    100%     { width: 0;                  margin-right: 0;                  }
  }

  /* ── Mobile: override custom properties so animation uses correct sizes ── */
  @media (max-width: 767px) {
    .avatar-wrap {
      --avatar-size: clamp(60px, 18vw, 130px);
      --avatar-gap: 12px;
    }
  }
</style>
