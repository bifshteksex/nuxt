<template>
  <div class="light:bg-white dark:bg-gray-900 transition-colors duration-300 min-h-screen pb-10"
    :class="{ 'gradient-background': isAuthPage }">
    <Header v-if="!isAuthPage" />
    <NuxtPage />
    <ThemeToggle />
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue';
import ThemeToggle from '@/components/ThemeToggle.vue';
import { useRoute, useRouter } from 'nuxt/app';
import { onMounted, computed } from 'vue';

const router = useRouter();

onMounted(async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/auth/login');
    return;
  }
});

const route = useRoute();

const isAuthPage = computed(() => {
  return route.path === '/auth/login' || route.path === '/auth/register';
});
</script>

<style scoped>
.gradient-background {
  background: linear-gradient(45deg, #632c73, #32195d, #30286f, #6a307f);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}
</style>