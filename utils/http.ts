import { sendRedirect } from 'h3';
import { useMessage } from '@/composables/use-antd-functional';

import type {
  AsyncData,
  UseFetchOptions as _UseFetchOptions
} from 'nuxt/dist/app/composables';
import type { WritableComputedRef } from 'vue';
import type { MaybeRef } from '@vueuse/core';
import type { SearchParameters } from 'ofetch';

interface ResOptions {
  data: string | number | object | object[];
  code: number;
  msg: string;
};

type PostRequestBody = MaybeRef<Record<string, any>>;
type UseFetchOptions = _UseFetchOptions<ResOptions>;
type OtherUseFetchOptions = Omit<UseFetchOptions, 'query' | 'body' | 'headers'>;
export type WatchOption = OtherUseFetchOptions['watch'];
export type HttpResponse<T> =
  Promise<
    Pick<
      AsyncData<T, Error>,
      'refresh' | 'pending'
    > & Record<'data', WritableComputedRef<T>>
  >;

/**
 * 封装 useFetch
 * @param { string } url 请求地址
 * @param { UseFetchOptions } options useFetchOptions
 * @param { object } headers 自定义Headers
 */
const fetch = (
  url: string,
  options?: UseFetchOptions,
  headers?: HeadersInit
) => {
  // consider to send cookies instead of adding token to the headers
  const originalHeaders = useRequestHeaders(['cookie']);

  const customHeaders = originalHeaders 
    ? {
      // proxy bypass cookies from client, only work in server-side call on API
      ...headers,
      cookie: originalHeaders.cookie ?? ''
    }
    : headers;
  const event = process.server ? useRequestEvent() : undefined;
  const message = process.server ? undefined : useMessage();

  const redirectToLogin = async () => {
    if(process.server) {
      return sendRedirect(event!, '/login', 301);
    }
    else {
      message!.error('登录信息过期，请重新登录');
      await navigateTo('/login', { redirectCode: 302 });
    }
  };

  return new Promise(async (resolve, reject) => {

    // only use response error interceptor when set option immediate to false,
    // cause those request on take place on client-side
    const onResponseError: UseFetchOptions['onResponseError'] | undefined =
      options?.immediate === false
      ? async ({ response }) => {
        const { status } = response;
        if(status === 401 || status === 409) redirectToLogin();
        else if(status === 403) 
          message!.error('你的权限不足');
      }
      : undefined
    const { data: _data, error, refresh, pending } = await useFetch(
      url,
      { 
        credentials: 'include',
        headers: customHeaders,
        // onResponse,
        onResponseError,
        ...options
      }
    );

    // skip the error handling process when set option immediate to false;
    if(options?.immediate === false) 
      return resolve({ data: computed({
        get: () => _data.value?.data,
        set: val => _data.value!.data = val!
      }), refresh, pending });

    // error handling for fetch failures
    if(error.value) {
      const { statusCode } = error.value;
      if(statusCode === 401 || statusCode === 409) 
        redirectToLogin();
      else if(statusCode === 403) 
        message!.error('你的权限不足');
      
      message?.error('网络异常'); 
      reject(error.value);
    };

    // custom errors handling in response.ok situations
    if(_data.value && _data.value.code !== (200 || 1)) {
      message?.error(_data.value!.msg);
      return reject(_data.value!.msg);
    }
    return resolve({ data: computed({
      get: () => _data.value!.data,
      set: val => _data.value!.data = val
    }), refresh, pending });
  });
};


export const get = (
  url: string,
  query?: SearchParameters,
  headers?: HeadersInit,
  otherOptions?: OtherUseFetchOptions
) =>
  fetch(url, { method: 'get', query, ...otherOptions }, headers);

export const post = (
  url: string,
  body?: PostRequestBody,
  headers?: HeadersInit,
  otherOptions?: OtherUseFetchOptions
) =>
  fetch(url, { method: 'post', body, ...otherOptions }, {
    'Content-Type': 'application/json',
    ...headers
  });