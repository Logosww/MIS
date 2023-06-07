<template>
  <div id="app">
    <a-config-provider
      :theme="myTheme"
      :locale="zhCN"
    >
    <!-- <ClientOnly>
      <message-context-holder />
      <notification-context-holder />
      <modal-context-holder />
    </ClientOnly> -->
      <!-- <style-provider> -->
        <NuxtLayout>
          <NuxtLoadingIndicator />
          <NuxtPage />
        </NuxtLayout>
      <!-- </style-provider> -->
    </a-config-provider>
  </div>
</template>

<script lang="ts" setup>
import { theme } from 'ant-design-vue';
// import { createCache, extractStyle, StyleProvider } from 'ant-design-vue/es/_util/cssinjs';
import { isDarkInjectionKey } from '@/tokens';
// import { message, notification, Modal } from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import '@/assets/style/my-prefight.css';

const isDark = useDark();
provide(isDarkInjectionKey, isDark);

const myTheme = computed(() => ({
  token: {
    colorPrimary: '#4f46e5',
    borderRadius: 8
  },
  algorithm: isDark.value ? theme.darkAlgorithm : theme.defaultAlgorithm
}));

// const app = getCurrentInstance();
// const [messageInstance, messageContextHolder] = message.useMessage();
// const [notificationInstance, notificationContextHolder] = notification.useNotification();
// const [modalInstance, modalContextHolder] = Modal.useModal();
// if(app) {
//   const target = app.appContext.config.globalProperties;
//   target['$message'] = messageInstance;
//   target['$notification'] = notificationInstance;
//   target['$modal'] = modalInstance;
// }
</script>
