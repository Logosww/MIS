<template>
  <a-input class="w-56 mr-6" :value="queryInput" placeholder="搜索用户名" @update:value="(val: string) => handleQuery(val)" allow-clear>
    <template #prefix>
      <search-outlined class="mr-2" />
    </template>
  </a-input>
  <a-button type="primary" class="mb-4" @click="handleAdd">
    <template #icon>
      <plus-outlined />
    </template>
    添加用户
  </a-button>
  <client-only>
    <a-spin :spinning="isLoading" :delay="50">
      <a-table :columns="columns" :data-source="queryResult ?? data" rowKey="id">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'image'">
            <a-image class="rounded-lg" width="72px" height="72px" :src="record.image" v-if="record.image" />
          </template>
          <template v-if="column.dataIndex === 'action'">
            <a-button type="text" @click="handleModify(record.id)">
              <template #icon>
                <edit-outlined />
              </template>
              编辑
            </a-button>
            <a-popconfirm
              title="删除后不可撤销，确认删除吗？"
              placement="bottom"
              @confirm="handleDelete(record.id)"
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
  </client-only>
  <profile-modal v-model="modalVisible" :user-id="currentId" :is-add="isAdd" @submit="handleSubmit" />
</template>

<script lang="ts" setup>

import type { Profile } from '@/composables/use-api';

definePageMeta({
  layout: 'admin'
});

const columns = [
  {
    title: '用户名',
    dataIndex: 'username'
  },
  {
    title: '昵称',
    dataIndex: 'name'
  },
  {
    title: '头像',
    dataIndex: 'image'
  },
  {
    title: '邮箱',
    dataIndex: 'email'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 240
  }
];

const { data, refresh } = await useGetAllUsers();

const isLoading = ref(true);
const modalVisible = ref(false);
const isAdd = ref(false);
const currentId = ref('');
const queryInput = ref('');
const queryResult = ref<Profile[]>();

const handleDelete = async (id: string) => {
  await useDeleteUser(id);
  const index = data.value.findIndex(profile => profile.id === id);
  data.value.splice(index, 1);
  useMessage().success('删除成功');
};

const handleSubmit = (profile: Profile & { id: string }) => {
  if(isAdd.value) data.value.push(profile);
  else {
    const index = data.value.findIndex(row => row.id === currentId.value);
    data.value[index] = { ...profile };
  }
};

const handleAdd = () => {
  isAdd.value = true;
  currentId.value = '';
  modalVisible.value = true;
};

const handleModify = (id: string) => {
  isAdd.value = false;
  currentId.value = id;
  modalVisible.value = true;
};

const doQuery = useDebounceFn(val => {
  queryResult.value = data.value.filter(record => record.username.includes(val.toLowerCase()));
}, 250);

const handleQuery = (val: string) => {
  queryInput.value = val;
  doQuery(val);
};

onMounted(() => refresh().then(() => isLoading.value = false));
</script>