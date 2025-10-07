<template>
    <div class="flex items-center justify-center min-h-screen light:bg-gray-100 transition-colors duration-300">
        <div class="light:bg-white dark:bg-gray-800 p-8 rounded shadow-md w-96 transition-colors duration-300">
            <h2 class="light:text-gray-800 dark:text-white text-2xl font-semibold mb-4 transition-colors duration-300">
                Регистрация</h2>
            <div class="mb-4">
                <label
                    class="light:text-gray-700 dark:text-gray-300 block text-sm font-bold mb-2 transition-colors duration-300">Имя</label>
                <input
                    class="light:bg-gray-200 dark:bg-gray-700 light:text-gray-800 dark:text-white appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline transition-colors duration-300"
                    v-model="first_name" type="text" placeholder="Ваше имя">
            </div>
            <div class="mb-4">
                <label
                    class="light:text-gray-700 dark:text-gray-300 block text-sm font-bold mb-2 transition-colors duration-300">Фамилия</label>
                <input
                    class="light:bg-gray-200 dark:bg-gray-700 light:text-gray-800 dark:text-white appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline transition-colors duration-300"
                    v-model="last_name" type="text" placeholder="Ваша фамилия">
            </div>
            <div class="mb-4">
                <label
                    class="light:text-gray-700 dark:text-gray-300 block text-sm font-bold mb-2 transition-colors duration-300">Email</label>
                <input
                    class="light:bg-gray-200 dark:bg-gray-700 light:text-gray-800 dark:text-white appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline transition-colors duration-300"
                    v-model="email" type="email" placeholder="Email">
            </div>
            <div class="mb-6">
                <label
                    class="light:text-gray-700 dark:text-gray-300 block text-sm font-bold mb-2 transition-colors duration-300">Пароль</label>
                <input
                    class="light:bg-gray-200 dark:bg-gray-700 light:text-gray-800 dark:text-white appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline transition-colors duration-300"
                    v-model="password" type="password" placeholder="Пароль">
            </div>
            <div class="flex items-center justify-between">
                <button
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    @click="register">Регистрация</button>
                <NuxtLink to="/auth/login"
                    class="light:text-blue-500 dark:text-blue-400 hover:light:text-blue-800 hover:dark:text-blue-300 text-sm transition-colors duration-300">
                    Войти</NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'nuxt/app';

const first_name = ref('');
const last_name = ref('');
const email = ref('');
const password = ref('');
const router = useRouter();

async function register() {
    try {
        await axios.post('/api/auth/register', {
            first_name: first_name.value,
            last_name: last_name.value,
            email: email.value,
            password: password.value
        });
        router.push('/auth/login');
    } catch (error) {
        console.error(error);
    }
}
</script>