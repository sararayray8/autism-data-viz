<script>
  import ScrollySection from '$lib/components/ScrollySection.svelte';
  import SunburstChart from '$lib/components/charts/SunburstChart.svelte';

  // 4 scroll-driven steps — step 4 (sunburst 5) auto-advances from step 3
  const steps = [
    {
      size: 'section-title',
      title: 'In 2025, Dr. Fayez compiled autism screening data from individuals across all ages.',
      subtext: 'This dataset helps us explore how autism is represented across males and females.'
    },
    {
      size: 'headline',
      title: 'Of the individuals screened, 57.7% are male and 42.3% are female.',
      subtext: 'This imbalance suggests differences in how and when individuals are screened.'
    },
    {
      size: 'section-title',
      title: 'When broken down by age, screening patterns diverge further.',
      subtext: 'Boys are more frequently screened in early childhood, while girls show a slight increase in adolescence.'
    },
    {
      size: 'section-title',
      title: 'Overall, screenings among boys ages 0–12 exceed those of girls by more than 100%.',
      subtext: 'This raises an important question: why might early identification differ between genders?'
    },
  ];

  // Step 4 — same text/style as step 3, shown via auto-advance
  const step4 = {
    size: 'section-title',
    title: 'Overall, screenings among boys ages 0–12 exceed those of girls by more than 100%.',
    subtext: 'This raises an important question: why might early identification differ between genders?'
  };

  const allSteps = [...steps, step4];

  let scrollStep  = $state(0); // driven by ScrollySection (0–3)
  let displayStep = $state(0); // what the chart + text actually show (0–4)

  $effect(() => {
    if (scrollStep !== 3) {
      displayStep = scrollStep;
      return;
    }
    displayStep = 3;

    // Lock scroll so the user can't leave before sunburst 5 shows
    const noScroll = (e) => e.preventDefault();
    window.addEventListener('wheel',     noScroll, { passive: false });
    window.addEventListener('touchmove', noScroll, { passive: false });

    const unlock = () => {
      window.removeEventListener('wheel',     noScroll);
      window.removeEventListener('touchmove', noScroll);
    };

    const t = setTimeout(() => {
      displayStep = 4;
      unlock();
    }, 1800);

    return () => {
      clearTimeout(t);
      unlock();
    };
  });
</script>

<div id="section-c">
  <ScrollySection {steps} bind:activeStep={scrollStep}>

    {#snippet chart(_)}
      <SunburstChart activeStep={displayStep} />
    {/snippet}

    {#snippet text(_, __)}
      {@const step = allSteps[displayStep]}
      <div class="text-block">
        <p class={step.size ?? ''}>{step.title}</p>
        {#if step.subtext}
          <p class="body-lg">{step.subtext}</p>
        {/if}
      </div>
    {/snippet}

  </ScrollySection>
</div>

<style>
  .text-block {
    max-width: 640px;
    margin-inline: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  /* Cancel global margin-bottom on title/headline classes so only the flex
     gap controls spacing — identical across all 5 sunburst steps */
  .text-block p {
    margin: 0;
  }
</style>
