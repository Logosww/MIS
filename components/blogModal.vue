<template>
  <client-only>
    <a-modal
      v-model:open="modalVisible"
      :width="960"
      :body-style="{ padding: '10px 0' }"
      :title="blogId ? '编辑博客' : '发布博客'"
      :confirm-loading="confirmLoading"
      @ok="handleConfirm"
      centered
    >
      <div class="w-full flex mb-4">
        <span class="text-lg font-bold">标题：</span>
        <a-input class="flex-1" v-model:value="form.title" placeholder="请输入" />
      </div>
      <Editor
        v-model="form.content"
        api-key="qkzruwok1b2w0xv38p723m9rjdtl8lcfaj7yiegxks5wdmx2"
        :init="editInit"
      />
    </a-modal>
  </client-only>
</template>

<script lang="ts" setup>
import Editor from '@tinymce/tinymce-vue';

import type { Blog } from '@/composables/use-api';

const props = defineProps<{ 
  modelValue: boolean;
  blogId?: string;
}>();
const emit = defineEmits<{
  'update:modelValue': [val: boolean];
  'submit': [blog: Blog | void]
}>();

const confirmLoading = ref(false);
const form = reactive({
  title: '',
  content: ''
});

const { blogId } = props;
let progressHandler: (percent: number) => void;

const modalVisible = computed({
  get: () => props.modelValue,
  set: val => {
    emit('update:modelValue', val);
    return val;
  }
});

const { upload } = await useCOSUpload(progress => {
  const progressPercent = progress.percent * 100;
  progressHandler?.(progressPercent);
}, true);

const uploadImage = (
  blobInfo: {
    blob: () => Blob,
    filename: () => string
  },
  progress: (percent: number
) => void) => {
  progressHandler = progress;
  const blob = blobInfo.blob();
  const filename = blobInfo.filename();
  const extension = filename.split('.').at(-1);
  const file = new File([blob], filename, { type: `image/${extension}` });
  return upload(file);
};

const editInit = {
  language: 'zh_CN',
  plugins: ['link', 'image', 'autolink', 'preview', 'autoresize', 'autosave', 'fullscreen', 'media', 'insertdatetime', 'wordcount', 'searchreplace'],
  toolbar: [
    { name: '历史', items: [ 'undo', 'redo' ] },
    { name: '格式', items: [ 'styles' ] },
    { name: '样式', items: [ 'bold', 'italic' ] },
    { name: '对齐', items: [ 'alignleft', 'aligncenter', 'alignright', 'alignjustify' ] },
    { name: '缩进', items: [ 'outdent', 'indent' ] },
    { name: '插入', items: [ 'link', 'image', 'media' ] },
    { name: '预览', items: [ 'preview'] },
  ],
  browser_spellcheck: true,
  image_uploadtab: true,
  images_upload_handler: uploadImage,
};


const handleConfirm = async () => {
  let blog: Blog | void;
  confirmLoading.value = true;

  if(blogId) {
    await useModifyBlog({
      id: blogId,
      ...form
    });
    useMessage().success('编辑成功');
  }
  else {
    blog = (await usePostBlog(form)).data.value;
    useNotification().success({ message: '成功发布博客' });
  }
  emit('submit', blog);
  modalVisible.value = confirmLoading.value = false;
  setTimeout(() => {
    form.title = '';
    form.content = '';
  }, 200);
};

watchEffect(async () => {
  if(props.blogId) {
    const { data } = await useGetBlogDetail(props.blogId);
    const blogDetail = unref(data);
    form.title = blogDetail.title, form.content = blogDetail.title;
  }
});

</script>