<template>
  <div class="w-full mt-8">
    <h1 class="w-full text-3xl font-bold text-zinc-900 dark:text-zinc-100 transition-colors">{{ blog.title }}</h1>
    <div class="flex items-center h-12 text-zinc-700 dark:text-zinc-300 transition-colors">
      <clock-circle-outlined class="mr-2" />
      <span class="mr-4">{{ blog.createTime }}</span>
      <user-outlined class="mr-2" />
      <span>{{ blog.author.name ?? blog.author.username }}</span>
    </div>
    <a-divider />
    <div class="text-zin-900 dark:text-zinc-200" style="min-height: 1280px;" v-html="blog.content"></div>
  </div>
</template>

<script lang="ts" setup>

const route = useRoute();
const { id } = route.query;

const { data: blog } = await useGetBlogDetail(id as string);
</script>