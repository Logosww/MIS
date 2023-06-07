<template>
  <a-input class="w-72 mb-4" :value="queryInput" placeholder="搜索标题" @update:value="(val: string) => handleQuery(val)" allow-clear>
    <template #prefix>
      <search-outlined class="mr-2" />
    </template>
  </a-input>
  <client-only>
    <a-spin :spinning="isLoading" :delay="50">
      <a-table :columns="columns" :data-source="queryResult ?? data" rowKey="id">
        <template #bodyCell="{ column, record: blog }">
          <template v-if="column.dataIndex === 'image'">
            <a-image class="rounded-lg" width="72px" height="72px" :src="blog.image" v-if="blog.image" />
          </template>
          <template v-if="column.dataIndex === 'action'">
            <a-button type="link" @click="(currentBlog = blog) && (drawerVisible = true)">
              <template #icon>
                <eye-outlined />
              </template>
              查看详情
            </a-button>
            <a-popconfirm
              title="删除后不可撤销，确认删除吗？"
              placement="bottom"
              @confirm="handleDelete(blog.id)"
            >
              <a-button type="text" @click="" danger>
                <template #icon>
                  <delete-outlined />
                </template>
                删除
              </a-button>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </a-spin>
    <a-drawer
      title="博客详情"
      placement="right"
      :width="640"
      v-model:open="drawerVisible"
    >
      <a-spin class="w-full h-full" :spinning="isLoadingContent" :delay="50">
        <h1 class="w-full text-3xl font-bold text-zinc-900 dark:text-zinc-100 transition-colors">{{ currentBlog?.title }}</h1>
        <div class="flex items-center h-12 text-zinc-700 dark:text-zinc-300 transition-colors">
          <clock-circle-outlined class="mr-2" />
          <span class="mr-4">{{ currentBlog?.createTime }}</span>
          <user-outlined class="mr-2" />
          <span>{{ currentBlog?.author.name ?? currentBlog?.author.username }}</span>
        </div>
        <div class="w-full h-full text-zin-900 dark:text-zinc-200" v-html="content"></div>
      </a-spin>
    </a-drawer>
  </client-only>
</template>

<script lang="ts" setup>

import type { Blog } from '@/composables/use-api';

definePageMeta({
  layout: 'admin'
});

const columns = [
  {
    title: '标题',
    dataIndex: 'title'
  },
  {
    title: '作者',
    dataIndex: ['author', 'username']
  },
  {
    title: '创建时间',
    dataIndex: 'createTime'
  },
  {
    title: '最后更新',
    dataIndex: 'updateTime'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 260
  }
];

const { data, refresh } = await useGetAllBlogs();

const isLoading = ref(true);
const isLoadingContent = ref(false);
const drawerVisible = ref(false);
const currentBlog = ref<Blog>();
const content = ref('');
const queryInput = ref('');
const queryResult = ref<Blog[]>();

const handleDelete = async (id: string) => {
  await useDeleteBlog(id);
  const index = data.value.findIndex(blog => blog.id === id);
  data.value.splice(index, 1);
  useMessage().success('删除成功');
};

const handleDrawerOpen = async () => {
  isLoadingContent.value = true;
  const id = currentBlog.value!.id;
  content.value = (await useGetBlogDetail(id)).data.value.content;
  isLoadingContent.value = false;
};

const doQuery = useDebounceFn(val => {
  queryResult.value = data.value.filter(blog => blog.title.includes(val.toLowerCase()));
}, 250);

const handleQuery = (val: string) => {
  queryInput.value = val;
  doQuery(val);
};

watch(() => drawerVisible.value, val => {
  val && handleDrawerOpen();
});

onMounted(() => refresh().then(() => isLoading.value = false));
</script>