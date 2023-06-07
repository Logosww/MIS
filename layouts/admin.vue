<template>
  <a-layout hasSider>
    <a-layout-sider class="h-screen" collapsible>
      <div class="h-20 p-4">
        <div class="w-full h-full rounded-lg bg-slate-600"></div>
      </div>
      <client-only>
        <a-menu
          theme="dark"
          v-model:selectedKeys="currentRoutePath"
          :items="menuItems"
          @click="handleNavigate"
        />
      </client-only>
      <div class="absolute bottom-16 w-full flex flex-col items-center">
        <toggle-dark class="mb-4" />
        <client-only>
          <a-dropdown class="cursor-pointer" placement="left">
            <a-avatar class="bg-indigo-500 select-none transition-colors hover:bg-indigo-600" :size="50" :src="profile.image">
              {{ profile.name ?? profile.username }}
            </a-avatar>
            <template #overlay>
              <a-card style="width: 240px; padding: 0;">
                <template #cover>
                  <img
                    alt="example"
                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                  />
                </template>
                <template #actions>
                  <a-button type="link" @click="modalVisible = true">
                    编辑资料
                    <template #icon>
                      <edit-outlined />
                    </template>
                  </a-button>
                  <a-button type="link" @click="handleLogout">
                    登出
                    <template #icon>
                      <logout-outlined />
                    </template>
                  </a-button>
                </template>
                <a-card-meta :title="profile.name ?? profile.username" :description="profile.email">
                  <template #avatar>
                    <a-avatar class="bg-indigo-500" :src="profile.image">{{ profile.name ?? profile.username }}</a-avatar>
                  </template>
                </a-card-meta>
              </a-card>
            </template>
          </a-dropdown>
        </client-only>
        <div></div>
      </div>
    </a-layout-sider>
    <a-layout class="py-6 px-6 xl:px-16 2xl:px-64">
      <a-card class="overflow-hidden mb-8" :body-style="{ padding: 0, cursor: 'auto' }" hoverable>
        <a-breadcrumb class="m-6 mb-1" :routes="routes">
          <template #itemRender="{ route, paths: itemPaths }">
            <span v-if="routes.indexOf(route) === routes.length - 1">
              {{ route.breadcrumbName }}
            </span>
            <router-link :to="`/${itemPaths.join('/')}`" v-else>
              {{ route.breadcrumbName }}
            </router-link>
          </template>
        </a-breadcrumb>
        <a-page-header
          class="pt-0"
          :title="routes.at(-1)!.title ?? routes.at(-1)!.breadcrumbName"
          :sub-title="routes.at(-1)!.subTitle"
        />
      </a-card>
      <a-layout-content>
        <slot />
      </a-layout-content>
    </a-layout>
  </a-layout>
  <profile-modal v-model="modalVisible" @submit="handleModified" />
</template>

<script lang="ts" setup>
import { 
  SettingOutlined,
  TeamOutlined,
  EditOutlined,
  ReadOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue';
import { breadcrumbPathMap } from '@/constants';

import type { Profile } from '@/composables/use-api';

const route = useRoute();
const currentRoutePath = ref([route.path]);
const routes = computed(() => {
  let paths = route.path.split('/').slice(2);
  paths.unshift('');
  return paths.map(path => breadcrumbPathMap[path]);
});

const menuItems = [
  {
    key: '/admin/blogs',
    icon: () => h(ReadOutlined),
    label: '博客管理',
    title: '博客管理'
  },
  {
    key: '/admin/users',
    icon: () => h(TeamOutlined),
    label: '用户管理',
    title: '用户管理',
  },
  {
    key: '/admin/setting',
    icon: () => h(SettingOutlined),
    label: '系统设置',
    title: '系统设置',
  }
];

const modalVisible = ref(false);

const { data: profile } = await useGetUserProfile();

const handleLogout = () => {
  useModal().confirm({
    title: '登出',
    icon: () => h(ExclamationCircleOutlined),
    content: '确认登出吗？',
    okText: '确认',
    async onOk() {
      await useAuth().signOut();
    }
  });
};

const handleModified = (val: Profile) => profile.value = val;

const handleNavigate = (menuItem: typeof menuItems[number]) => 
 (currentRoutePath.value = [menuItem.key]) && navigateTo(menuItem.key);
</script>
