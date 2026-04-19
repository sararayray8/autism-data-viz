<script>
  import { onMount } from 'svelte';

  let outerEl;
  let opacity = $state(1);

  onMount(() => {
    const handleScroll = () => {
      if (!outerEl) return;
      const rect  = outerEl.getBoundingClientRect();
      const total = outerEl.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const progress = Math.max(0, Math.min(1, -rect.top / total));
      opacity = 1 - progress;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  });
</script>

<div id="cover" class="cover-outer" bind:this={outerEl}>
  <div class="cover-sticky" style="opacity: {opacity}">
    <h1 class="cover-title">Autism Is Not One Size Fits All: How Gender Affects Detection</h1>
    <p class="cover-author">Sara Spencer | April 2026</p>
  </div>
</div>

<style>
  .cover-outer {
    position: relative;
    height: 200vh;
  }

  .cover-sticky {
    position: sticky;
    top: 0;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 16px;
    padding-inline: var(--margin-outer);
  }

  .cover-title {
    font-family: var(--font-headline);
    font-size: 30px;
    font-weight: 600;
    color: var(--color-text);
    max-width: 680px;
    line-height: 1.3;
  }

  .cover-author {
    font-family: var(--font-body);
    font-size: 24px;
    font-weight: 500;
    color: var(--color-muted);
  }

</style>
