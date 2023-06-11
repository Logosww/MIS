import { get, post } from '@/utils/http';

import type { HttpResponse } from '@/utils/http';

export interface COSBucketSecret {
  credentials: {
    tmpSecretId: string;
    tmpSecretKey: string;
    sessionToken: string;
  };
  startTime: number;
  expiredTime: number;
};

export interface Profile {
  name: string;
  username: string;
  email: string;
  image: string;
};

export interface Blog {
  id: string;
  authorId: string;
  author: {
    name: string;
    username: string;
    image: string;
  };
  title: string;
  createTime: string;
  updateTime: string;
};

export interface BlogDetail extends Blog {
  content: string
};

export const useRegister = (params: { username: string; password: string }) =>
  post('/api/user/register', params) as HttpResponse<string>;

export const useGetCOSSecret = () => 
  post('https://signdesk.ishortv.top/signdesk/cos/getSecret', undefined, undefined, { immediate: false }) as HttpResponse<COSBucketSecret>;

export const useGetUserProfile = (id?: string) =>
  get('/api/user/getProfile', id ? { id } : undefined) as HttpResponse<Profile>;

export const useModifyUserProfile = (params: Profile & { id?: string }) =>
  post('/api/user/modify', params) as HttpResponse<null>;

export const useGetAllUsers = () =>
  get('/api/user/list', undefined, undefined, { immediate: false }) as HttpResponse<(Profile & { id?: string })[]>;

export const useDeleteUser = (id: string) =>
  post('/api/user/delete', { id }) as HttpResponse<null>;

export const useGetAllBlogs = () =>
  get('/api/blog/list', undefined, undefined, { immediate: false }) as HttpResponse<Blog[]>;

export const useGetBlogDetail = (id: string) =>
  get('/api/blog/getDetail', { id }) as HttpResponse<BlogDetail>;

export const usePostBlog = (pramas: { title: string, content: string }) =>
  post('/api/blog/post', pramas) as HttpResponse<Blog>;

export const useModifyBlog = (pramas: { id: string; title: string, content: string }) =>
  post('/api/blog/modify', pramas) as HttpResponse<null>;

export const useDeleteBlog = (id: string) =>
  post('/api/blog/delete', { id }) as HttpResponse<null>;

export const useGetUserCount = () =>
  get('/api/user/count') as HttpResponse<number>;

export const useGetBlogCount = () =>
  get('/api/blog/count') as HttpResponse<number>;