<template>
  <div class="relative rounded-xl bg-white p-8 shadow-md dark:bg-[#100c2a]" style="height: 30rem">
    <client-only>
      <chart-content :option="option" ref="chartContentRef" />
    </client-only>
  </div>
</template>

<script lang="ts" setup>
import type { ECOption } from './chartContent.vue';

defineProps<{
  option: ECOption
}>();

</script>