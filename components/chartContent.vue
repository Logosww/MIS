<template>
  <div ref="containerRef" class="w-full h-full"></div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts/core';
import {
  BarChart,
  LineChart,
  PieChart,
  RadarChart
} from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { isDarkInjectionKey } from '@/tokens'; 

import type {
  BarSeriesOption, 
  LineSeriesOption,
  PieSeriesOption,
  RadarSeriesOption
} from 'echarts/charts';
import type {
  TitleComponentOption,
  TooltipComponentOption,
  GridComponentOption,
  LegendComponentOption
} from 'echarts/components';
import type { 
  ComposeOption,
  ECharts
} from 'echarts/core';

type ECSeriesOption = 
  | BarSeriesOption
  | LineSeriesOption
  | PieSeriesOption
  | RadarSeriesOption;

export type ECOption = ComposeOption<
  | ECSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | LegendComponentOption
>;

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
]);

const props = defineProps<{
  option: ECOption
}>();

const containerRef = ref<HTMLDivElement>();
let chart: ECharts;

useResizeObserver(containerRef, () => chart!.resize());

onMounted(() => {
  const dom = containerRef.value!
  chart = echarts.init(dom);

  chart.setOption(props.option);
});

const isDark = inject(isDarkInjectionKey)!;

watch(isDark, (val) => {
  chart.dispose();
  chart = echarts.init(containerRef.value!, val ? 'dark' : undefined);
  chart.setOption(props.option);
});
</script>