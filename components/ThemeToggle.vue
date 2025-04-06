<template>
    <button class="fixed bottom-4 right-4" @click="toggleTheme">
        <Icon name="mdi:theme-light-dark" size="2em"
            class="light:text-gray-800 dark:text-white transition-colors duration-300" />
    </button>
</template>

<script setup>
function toggleTheme() {
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
}

onMounted(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
});
</script>