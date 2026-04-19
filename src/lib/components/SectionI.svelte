<script>
  import ScrollySection from '$lib/components/ScrollySection.svelte';

  const chartSrcs = [
    '/charts/Dot-plot-1.svg',
    '/charts/Dot-plot-2.svg',
    '/charts/delta-chart-1.svg',
    '/charts/delta-chart-2.svg',
    '/charts/delta-chart-3.svg',
  ];

  const steps = [
    { size: 'section-title', title: 'Autism traits show differently across genders.' },
    { size: 'section-title', title: "There are 'core' neurological traits that are present in both genders." },
    { size: 'section-title', title: 'However, there are some subtle differences across the questions.' },
    { size: 'section-title', title: 'Boys are mostly flagged for challenges with social cues, empathy, and unusual first words.' },
    { size: 'section-title', title: 'While girls are flagged higher on attention-related behaviors.' },
  ];
</script>

<div id="section-i">
  <ScrollySection {steps}>

    {#snippet chart(activeStep)}
      <img
        class="chart-img"
        src={chartSrcs[activeStep]}
        alt="Chart — step {activeStep}"
      />
    {/snippet}

    {#snippet text(activeStep, step)}
      <div class="text-block" class:wide={activeStep === 3}>
        <p class={step.size}>{step.title}</p>
      </div>
    {/snippet}

  </ScrollySection>
</div>

<style>
  .chart-img {
    width: min(860px, 85vw);
    aspect-ratio: 1068 / 657;
    object-fit: contain;
    display: block;
  }

  .text-block {
    max-width: 580px;
    margin-inline: auto;
  }

  .text-block.wide {
    max-width: 780px;
  }

  @media (max-width: 767px) {
    .chart-img { width: min(600px, 92vw); }
  }
</style>
