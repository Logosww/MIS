import { message, notification, Modal } from 'ant-design-vue';

// type FunctionalCompInstance<T extends (...args: any) => any> = ReturnType<T>[0];

// const getGlobalFunc = (name: string) => {
//   const { vueApp } = useNuxtApp();
//   const appContext = vueApp._context;
//   return appContext.config.globalProperties[name];
// };

// export const useMessage = () => 
//   getGlobalFunc('$message') as FunctionalCompInstance<typeof message.useMessage>;

// export const useNotification = () => 
//   getGlobalFunc('$notification') as FunctionalCompInstance<typeof notification.useNotification>;

// export const useModal = () =>
//   getGlobalFunc('$modal') as FunctionalCompInstance<typeof Modal.useModal>;

export const useMessage = () => message;
export const useNotification = () => notification;
export const useModal = () => Modal;