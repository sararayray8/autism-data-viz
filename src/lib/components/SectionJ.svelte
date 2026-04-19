<script>
  import ScrollySection from '$lib/components/ScrollySection.svelte';

  const chartSrcs = [
    '/charts/delta-chart-1.svg',
    '/charts/delta-chart-2.svg',
    '/charts/delta-chart-3.svg',
  ];

  const steps = [
    {
      size: 'section-title',
      title: 'However, there are some subtle differences across the questions.'
    },
    {
      size: 'section-title',
      title: 'Boys are mostly flagged for challenges with social cues, empathy, and unusual first words.'
    },
    {
      size: 'section-title',
      title: 'While girls are flagged higher on attention-related behaviors.'
    }
  ];
</script>

<div id="section-j">
  <ScrollySection {steps}>

    <!-- No {#key} or transition — parent panel fade handles the swap -->
    {#snippet chart(activeStep)}
      <img
        class="delta-img"
        src={chartSrcs[activeStep]}
        alt="Diverging bar chart — step {activeStep}"
      />
    {/snippet}

    {#snippet text(activeStep, step)}
      <div class="text-block">
        <p class={step.size}>{step.title}</p>
      </div>
    {/snippet}

  </ScrollySection>
</div>

<style>
  .delta-img {
    width: min(800px, 85vw);
    aspect-ratio: 1068 / 657;
    object-fit: contain;
    display: block;
  }

  .text-block {
    max-width: 780px;
    margin-inline: auto;
  }

  @media (max-width: 767px) {
    .delta-img { width: min(600px, 92vw); }
  }
</style>
