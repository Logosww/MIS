<template>
  <client-only>
    <a-modal 
      :title="isAdd ? '添加账号' : '编辑资料'"
      :body-style="{ padding: '10px 20px' }"
      v-model:open="modalVisible"
      :confirm-loading="confirmLoading"
      @ok="handleConfirm"
      @cancel="handleCancel"
      centered
    >
      <a-form
        ref="formRef"
        :model="profile"
        :labelCol="{ span: 5 }"
        :wrapperCol="{ span: 18 }"
      >
        <a-form-item label="头像" name="image">
          <a-upload
            accept="image/png, image/jpeg"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :customRequest="doUpload"
            @before-upload="beforeUpload"
            @change="handleFileChange"
            supportServerRender
          >
            <img class="rounded-lg" v-if="profile.image" :src="profile.image" alt="avatar" />
            <div v-else>
              <loading-outlined v-if="isUploading"></loading-outlined>
              <plus-outlined v-else></plus-outlined>
              <div class="ant-upload-text">上传</div>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item label="用户名" name="username">
          <a-input v-model:value="profile.username" v-if="isAdd">
            <template>
              <user-outlined class="mr-2" />
            </template>
          </a-input>
          <div v-else>
            <user-outlined class="mx-2" />
            {{ profile.username }}
          </div>
        </a-form-item>
        <a-form-item label="密码" v-if="isAdd">
          <a-input-password v-model:value="password">
            <template #prefix>
              <lock-outlined class="mr-2" />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item label="确认密码" v-if="isAdd">
          <a-input-password v-model:value="rePassword">
            <template #prefix>
              <lock-outlined class="mr-2" />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item label="昵称" name="name">
          <a-input v-model:value="profile.name">
            <template #prefix>
              <idcard-outlined class="mr-2" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item label="邮箱" name="email">
          <a-input v-model:value="profile.email">
            <template #prefix>
              <mail-outlined class="mr-2" />
            </template>
          </a-input>
        </a-form-item>
      </a-form>
    </a-modal>
  </client-only>
</template>

<script lang="ts" setup>
import { Upload } from 'ant-design-vue';

import type { Profile } from '@/composables/use-api';
import type { UploadChangeParam, FormInstance } from 'ant-design-vue';


const props = defineProps<{ 
  modelValue: boolean;
  userId?: string;
  isAdd?: boolean;
}>();
const emit = defineEmits<{ 
  'update:modelValue': [val: boolean],
  'submit': [profile: Profile & { id: string }]
}>();

const isUploading = ref(false);
const confirmLoading = ref(false);
const password = ref('');
const rePassword = ref('');

const formRef = ref<FormInstance>();

const modalVisible = computed({
  get: () => props.modelValue,
  set: val => {
    emit('update:modelValue', val);
    return val;
  }
});

const profile = reactive<Profile>({
  name: '',
  username: '',
  email: '',
  image: ''
});

const { upload } = await useCOSUpload(undefined, true);

const doUpload = async (data: { file: File }) => {
  const { file } = data;
  const imageUrl = await upload(file, 'temp');
  profile.image = imageUrl;
  isUploading.value = false;
  useMessage().success('上传成功');
};

const beforeUpload = (file: File) => {
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    useMessage().error('上传图片大小应小于2MB');
  }
  return isLt2M ?? Upload.LIST_IGNORE;
}

const handleFileChange = (info: UploadChangeParam) => {
  if (info.file.status === 'uploading') {
    isUploading.value = true;
    return;
  }
  if (info.file.status === 'error') {
    isUploading.value = false;
    useMessage().error('上传失败');
  }
};

const handleConfirm = async () => {
  let id = '';
  confirmLoading.value = true;
  if(props.isAdd) {
    const { data: uid } = await useRegister({ username: profile.username, password: password.value });
    id = uid.value;
    await useModifyUserProfile({ ...profile, id });
    useMessage().success('添加成功');
  } else {
    await useModifyUserProfile({ ...profile, id: props.userId });
    useMessage().success('编辑成功');
  }
  confirmLoading.value = false;
  emit('submit', { ...profile, id });
  modalVisible.value = false;
};

const handleCancel = () => {
  setTimeout(() => {
    isUploading.value = false;
    confirmLoading.value = false;
    password.value = rePassword.value = '';
    formRef.value?.resetFields();
  }, 500);
};

watch(() => props.modelValue, async val => {
  if(val && !props.isAdd) {
    const { data } = await useGetUserProfile(props.userId);
    Object.entries(data.value)
      .forEach(([key, value]) => (profile as Record<string, string>)[key] = value);
  }
})

</script>

<style scoped>
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>