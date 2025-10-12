<template>
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 dark:text-gray-200">
        <div class="border rounded p-4 dark:bg-gray-800 dark:border-gray-700">
            <div class="flex gap-x-5 items-start justify-between">
                <div class="w-full">
                    <p v-if="titleError" class="text-red-500">{{ titleError }}</p>
                    <input placeholder="Название тикета" v-model="title"
                        class="w-full text-2xl font-semibold dark:text-gray-200 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-900 dark:border-gray-700 dark:placeholder-gray-500 dark:focus:ring-gray-600" />
                    <textarea placeholder="Описание" v-model="description"
                        class="w-full h-52 text-gray-600 dark:text-gray-400 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-900 dark:border-gray-700 dark:placeholder-gray-500 dark:focus:ring-gray-600"></textarea>
                </div>
            </div>
            <div class="flex justify-center items-center">
                <button
                    class="cursor-pointer mt-2 bg-[#6366f1] hover:bg-[#595ab4] text-white font-bold py-2 px-4 rounded"
                    @click="createTicket">
                    Сохранить
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'nuxt/app';
import { jwtDecode } from 'jwt-decode';

const { $api } = useNuxtApp();

const title = ref('');
const description = ref('');
const status = ref(1);
const router = useRouter();
const titleError = ref('');

async function createTicket() {
    if (!title.value.trim()) {
        titleError.value = 'Пожалуйста, заполните название тикета.';
        return;
    }

    titleError.value = '';

    try {
        const userId = getUserIdFromToken();
        if (!userId) {
            console.error('Пользователь не авторизован');
            return;
        }

        await $api.post('/tickets', {
            title: title.value,
            description: description.value,
            status_id: status.value,
            created_by: userId,
        });
        router.push('/tickets');
    } catch (error) {
        console.error('Ошибка создания тикета:', error);
    }
}

function getUserIdFromToken() {
    const token = localStorage.getItem('token');
    if (!token) {
        return null;
    }

    try {
        const decodedToken = jwtDecode(token);
        return decodedToken.id;
    } catch (error) {
        console.error('Ошибка декодирования токена', error);
        return null;
    }
}
</script>