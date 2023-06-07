<template>
  <a-layout>
    <a-layout-header :class="['fixed','w-full', 'z-20', 'navbar', scrollY > 64 ? 'active' : '']" :style="{ paddingInline: 0, backgroundColor: 'transparent' }">
      <div class="h-full px-8 lg:px-24 xl:px-48 2xl:px-72 flex items-center justify-between bg-slate-100/80 dark:bg-zinc-800/70 border border-x-0 border-b-indigo-200 dark:border-b-indigo-800 shadow-lg shadow-indigo-500/10 dark:shadow-indigo-500/30 backdrop-blur-sm backdrop-saturate-150">
        <div class="w-48 h-9 bg-indigo-400 dark:bg-indigo-600 rounded-lg"></div>
        <div class="flex items-center">
          <toggle-dark class="mr-4" :size="40" ghost />
          <client-only>
            <a-dropdown class="cursor-pointer" placement="top" arrow>
              <a-avatar :src="profile.image" :size="48">{{ profile.name ?? profile.username }}</a-avatar>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="modalVisible = true">
                    <template #icon>
                      <edit-outlined />
                    </template>
                    编辑资料
                  </a-menu-item>
                  <a-menu-item @click="handleLogout">
                    <template #icon>
                      <logout-outlined />
                    </template>
                    登出
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </client-only>
        </div>
      </div>
    </a-layout-header>
    <a-layout-content class="w-full h-full pt-16 bg-white dark:bg-neutral-900 px-8 lg:px-24 xl:px-48 2xl:px-72">
      <slot />
    </a-layout-content>
    <a-layout-footer>

    </a-layout-footer>
  </a-layout>
  <profile-modal v-model="modalVisible" />
</template>

<script lang="ts" setup>
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';

const modalVisible = ref(false);

const { data: profile } = await useGetUserProfile();

const { y: scrollY } = useWindowScroll();

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
</script>

<style scoped>
.navbar.active {
  animation: slide-down-in .5s cubic-bezier(0.22,0.61,0.36,1) forwards;
}

@keyframes slide-down-in {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translate(0);
  }
}
</style>