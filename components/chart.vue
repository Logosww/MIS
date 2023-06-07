<template>
  <a-card class="relative rounded-lg h-96" :body-style="{ padding: 0, width: '100%', height: '100%' }" hoverable>
    <client-only>
      <chart-content :option="option" />
    </client-only>
  </a-card>
</template>

<script lang="ts" setup>
import type { ECOption } from './chartContent.vue';

defineProps<{
  option: ECOption
}>();

</script>