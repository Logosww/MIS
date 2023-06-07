import type { InjectionKey } from 'vue';
import type { WritableComputedRef } from 'nuxt/dist/app/compat/capi';

export const isDarkInjectionKey: InjectionKey<WritableComputedRef<boolean>> = Symbol('isDarkInjectionKey');