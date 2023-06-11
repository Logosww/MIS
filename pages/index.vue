<template>
  <div class="my-8">
    <a-list item-layout="vertical" :data-source="data" :pagination="false">
    <template #renderItem="{ item: blog }">
      <a-list-item>
        <a-list-item-meta>
          <template #title>
            <a class="text-2xl leading-10 font-bold" :href="`/blog?id=${blog.id}`" target="_blank">{{ blog.title }}</a>
          </template>
          <template #avatar>
            <a-avatar :size="44" :src="blog.author.image">{{ blog.author.name ?? blog.author.username }}</a-avatar>
          </template>
        </a-list-item-meta>
        <template #actions>
          <span>
            <component :is="ClockCircleOutlined" class="mr-1" />
            {{ blog.createTime }}
          </span>
        </template>
      </a-list-item>
    </template>
  </a-list>
  </div>
  <client-only>
    <a-tooltip placement="bottom">
      <a-button class="fixed right-12 bottom-48 mr-8 lg:mr-24 xl:mr-48 2xl:mr-72 shadow-lg shadow-indigo-500/60" shape="circle" type="primary" size="large" @click="modalVisible = true">
        <template #icon>
          <plus-outlined />
        </template>
      </a-button>
      <template #title>发布博客</template>
    </a-tooltip>
  </client-only>
  <blog-modal v-model="modalVisible" @submit="blog => data.unshift(blog)" />
</template>

<script lang="ts" setup>
import { ClockCircleOutlined } from '@ant-design/icons-vue';

const modalVisible = ref(false);

const { data, refresh: execute } = await useGetAllBlogs();
execute();

</script>