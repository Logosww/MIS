<template>
  <div class="absolute bg-slate-100 dark:bg-zinc-900 w-full h-full flex justify-center items-center">
    <div class="relative bg-white dark:bg-zinc-800 border border-gray-300 dark:border-gray-600 rounded-2xl overflow-hidden shadow-xl" style="width: 1000px; height: 680px;">
      <div class="w-1/2 h-full float-left overflow-hidden">
        <img class="w-full h-full object-cover transition-transform ease-out duration-300 hover:scale-105" src="@/assets/image/login_form_bg.jpg">
      </div>
      <div class="w-1/2 h-full px-16 py-48 float-right box-border">
        <div v-show="!isRegistry">
          <h2 class="text-slate-900 dark:text-white text-4xl font-semibold select-none">欢迎回来！请登录</h2>
          <a-form ref="formRef" class="mt-6" layout="vertical" :model="form" :rules="rules" @finish="handleLogin">
            <a-form-item name="username">
              <a-input size="large" placeholder="用户名" v-model:value="form.username" allow-clear>
                <template #prefix>
                  <user-outlined class="mr-2" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item name="password">
              <a-input-password size="large" placeholder="密码" v-model:value="form.password" allow-clear>
                <template #prefix>
                  <lock-outlined class="mr-2" />
                </template>
              </a-input-password>
            </a-form-item>
            <a-checkbox class="mb-4" v-model:checked="isAdmin">管理员</a-checkbox>
            <a-form-item>
              <a-button size="large" type="primary" html-type="submit" :loading="isLoading" block>登录</a-button>
            </a-form-item>
          </a-form>
          <p class="text-sm select-none text-slate-700">
            还没有账号？
            <a class="text-indigo-600 transition hover:text-indigo-900" href="#" @click="toRegisrty">立即注册</a>
          </p>
        </div>
        <div v-show="isRegistry">
          <a-button class="align-bottom mr-2" size="large" shape="circle" type="text" @click="toLogin"><arrow-left-outlined /></a-button>
          <h2 class="inline-block text-slate-900 dark:text-white text-4xl font-semibold select-none">注册账号</h2>
          <a-form class="mt-6" ref="regFormRef" :model="regForm" :rules="regRules" @finish="handleRegistry">
            <a-form-item name="regUsername">
              <a-input size="large" placeholder="用户名" v-model:value="regForm.regUsername" allow-clear>
                <template #prefix>
                  <user-outlined class="mr-2" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item name="regPassword">
              <a-input-password size="large" placeholder="密码" type="password" v-model:value="regForm.regPassword" allow-clear>
                <template #prefix>
                  <lock-outlined class="mr-2" />
                </template>
              </a-input-password>
            </a-form-item>
            <a-form-item name="regRepassword">
              <a-input-password size="large" placeholder="确认密码" type="password" v-model:value="regForm.regRepassword" allow-clear>
                <template #prefix>
                  <lock-outlined class="mr-2" />
                </template>
              </a-input-password>
            </a-form-item>
            <a-form-item>
              <a-button size="large" type="primary" html-type="submit" :loading="isLoading" block>注册并登录</a-button>
            </a-form-item>
          </a-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

import type { Rule } from 'ant-design-vue/es/form';

definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/',
  },
  layout: false
});

const isRegistry = ref(false);
const isLoading = ref(false);
const isAdmin = ref(false);
const formRef = ref();
const regFormRef = ref();

const form = reactive({
  username: '',
  password: ''
});
const regForm = reactive({
  regUsername: '',
  regPassword: '',
  regRepassword: ''
});

const rules: Record<string, Rule[]> = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
};
const regRules: Record<string, Rule[]> = {
  regUsername: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  regPassword: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  regRepassword: [{ required: true, message: '请确认密码', trigger: 'blur' }],
};

const { signIn } = useAuth();

const handleLogin = async () => {
  isLoading.value = true;
  const { error } = await (signIn('credentials', { ...form, redirect: false }) as Promise<{ error: string }>);
  // signIn('github');
  isLoading.value = false;
  if(error) useMessage().error('用户名或密码错误');
  else {
    useNotification().success({ message: '登录成功' });
    await navigateTo(isAdmin.value ? '/admin' : '/', { external: true });
  }
};

const handleRegistry = async () => {
  const form = {
    username: regForm.regUsername,
    password: regForm.regPassword
  };
  await useRegister(form)
  await signIn('credentials', { ...form, redirect: false });
  useNotification().success({ message: '登录成功' });
  await navigateTo(isAdmin.value ? '/admin' : '/');
};

const toRegisrty = () => {
  formRef.value.clearValidate();
  isRegistry.value = true;
}

const toLogin = () => {
  regFormRef.value.clearValidate();
  isRegistry.value = false;
};
</script>