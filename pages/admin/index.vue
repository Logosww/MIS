<template>
  <a-row :gutter="{ sm: 20, md: 30, lg: 40, xl: 50, xxl: 120 }">
    <a-col :span="8">
      <div class="px-6 py-8 bg-white dark:bg-neutral-900 shadow-md rounded-lg flex justify-between mb-8 transition-colors hover:bg-zinc-50 dark:hover:bg-neutral-800">
        <div>
          <div class="text-zinc-700 dark:text-slate-200">博客数</div>
          <div class="text-zinc-900 dark:text-slate-50 text-3xl font-semibold">{{ blogCount }}</div>
        </div>
        <div class="w-14 h-14 bg-indigo-500 flex items-center justify-center rounded-lg text-slate-50">
          <read-outlined class="float-right text-3xl" />
        </div>
      </div>
    </a-col>
    <a-col :span="8">
      <div class="px-6 py-8 bg-white dark:bg-neutral-900 shadow-md rounded-lg flex justify-between mb-8 transition-colors hover:bg-zinc-50 dark:hover:bg-neutral-800">
        <div>
          <div class="text-zinc-700 dark:text-slate-200">用户数</div>
          <div class="text-zinc-900 dark:text-slate-50 text-3xl font-semibold">{{ userCount }}</div>
        </div>
        <div class="w-14 h-14 bg-indigo-500 flex items-center justify-center rounded-lg text-slate-50">
          <team-outlined class="float-right text-3xl" />
        </div>
      </div>
    </a-col>
    <a-col :span="8">
      <div class="px-6 py-8 bg-white dark:bg-neutral-900 shadow-md rounded-lg flex justify-between mb-8 transition-colors hover:bg-zinc-50 dark:hover:bg-neutral-800">
        <div>
          <div class="text-zinc-700 dark:text-slate-200">浏览量</div>
          <div class="text-zinc-900 dark:text-slate-50 text-3xl font-semibold">71,897</div>
        </div>
        <div class="w-14 h-14 bg-indigo-500 flex items-center justify-center rounded-lg text-slate-50">
          <eye-outlined class="float-right text-3xl" />
        </div>
      </div>
    </a-col>
  </a-row>
  <a-row :gutter="60" class="mb-8">
    <a-col :span="16">
      <chart :option="lineOption" ref="lineChartRef" />
    </a-col>
    <a-col :span="8">
      <chart :option="pieOption" />
    </a-col>
  </a-row>
  <a-row :gutter="60">
    <a-col :span="12">
      <chart :option="radarOption" />
    </a-col>
    <a-col :span="12">
      <chart :option="gaugeOption" />
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts';
import moment from 'moment';

definePageMeta({
  layout: 'admin'
});

const mockData = () => {
  now = now.add(2, 'seconds');
  count +=  Math.random() * 21 - 10 | 0;
  return {
    name: now.toLocaleString(),
    value: [
      now.format('YYYY/MM/DD h:mm:ss'),
      count
    ]
  };
};
let lineData = [];
let now = moment().subtract(30, 'seconds'); // half hour ago
let count = 60 | 0 + Math.random() * 10;

for(let i = 0; i < 15; i++) lineData.push(mockData());

const lineOption = reactive({
  title: {
    text: '实时在线人数',
    left: 'center'
  },
  xAxis: {
    type: 'time',
    splitLine: {
      show: false
    }
  },
  yAxis: {
    type: 'value',
    boundaryGap: [0, '100%'],
    splitLine: {
      show: false
    }
  },
  tooltip: {
    trigger: 'axis'
  },
  series: [
    {
      data: lineData,
      type: 'line',
      smooth: true,
      showSymbol: false,
      lineStyle: {
        color: '#4338ca'
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgba(99,102,241,1)'
          },
          {
            offset: 1,
            color: 'rgba(99,102,241,0)'
          }
        ])
      }
    }
  ]
});

const pieOption = {
  title: {
    text: '博客类型占比',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: '博客类型',
      type: 'pie',
      radius: '50%',
      data: [
        { value: 1048, name: '科普' },
        { value: 735, name: '技术' },
        { value: 580, name: '求助' },
        { value: 484, name: '讨论' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
};

const radarOption = {
  title: {
    text: '站点 LightHouse 指标'
  },
  tooltip: {},
  radar: {
    indicator: [
      { name: '性能 Performance', max: 100 },
      { name: '可访问性 Accessibility', max: 100 },
      { name: '最佳实践 Best Practice', max: 100 },
      { name: '搜索引擎优化 SEO', max: 100 },
      { name: '渐近式应用 PWA', max: 100 }
    ]
  },
  series: [
    {
      name: 'LightHouse 指标',
      type: 'radar',
      data: [
        {
          value: [100, 91, 100, 78, 0]
        }
      ],
      areaStyle: {
        color: new echarts.graphic.RadialGradient(0.5, 0.5, .8, [
          {
            offset: 0,
            color: 'rgba(99,102,241,0)'
          },
          {
            offset: 1,
            color: 'rgba(99,102,241,1)'
          }
        ])
      }
    }
  ]
};

const gaugeOption = reactive({
  title: {
    text: '站点负载均衡'
  },
  tooltip: {
    formatter: '{a} <br/>{b} : {c}%'
  },
  series: [
    {
      name: '负载均衡',
      type: 'gauge',
      progress: {
        show: true
      },
      startAngle: 210,
      endAngle: -30,
      detail: {
        valueAnimation: true,
        formatter: '{value}'
      },
      data: [
        {
          value: 50,
          name: '综合资源消费'
        }
      ]
    }
  ]
});

const { data: blogCount } = await useGetBlogCount();
const { data: userCount } = await useGetUserCount();

onMounted(() => {
  setInterval(() => gaugeOption.series[0].data[0].value = 40 | 0 + Math.random() * 25, 3000);
  setInterval(() => lineOption.series[0].data.push(mockData()), 2000);
});
</script>