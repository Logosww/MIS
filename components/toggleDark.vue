<template>
  <div 
    :class="['toggle-dark-btn', isDark ? 'is-dark' : 'is-light', ghost ? 'is-ghost' : '']"
    :style="size ? { width: `${size}px`, height: `${size}px` } : undefined"
    @click="toggle()"
  >
    <icon-light v-show="!isDark" />
    <icon-dark v-show="isDark" />
  </div>
</template>

<script setup lang="ts">
import { isDarkInjectionKey } from '@/tokens';

defineProps<{ size?: number; ghost?: boolean }>();

const isDark = inject(isDarkInjectionKey)!;
const toggle = useToggle(isDark);
</script>

<style scoped>
.toggle-dark-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2em;
  cursor: pointer;
  color: var(--text-color);
  background-color: var(--bg-color);
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: .2s;
}

.toggle-dark-btn.is-light {
  --text-color: #eee;
  --bg-color: transparent;
}

.toggle-dark-btn.is-light.is-ghost {
  --text-color: rgb(99 102 241 / .8);
}

.toggle-dark-btn.is-light:hover {
  --bg-color: rgb(99 102 241 / .5);
}

.toggle-dark-btn.is-light.is-ghost:hover {
  --text-color: #fff;
  --bg-color: rgb(99 102 241 / .7);
}

.toggle-dark-btn.is-dark {
  color: #fff;
  --bg-color: rgb(99 102 241 / 1);
}

.toggle-dark-btn.is-dark:hover {
  --bg-color: #4338ca;
}
</style>

