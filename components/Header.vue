<template>
    <header>
        <nav class="bg-gray-800">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="flex h-16 items-center justify-between">
                    <div class="flex items-center">
                        <a href="/welcome/" class="shrink-0">
                            <img class="size-8"
                                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                                alt="Your Company">
                        </a>
                        <div class="hidden md:block">
                            <div class="ml-10 flex items-baseline space-x-4">
                                <NuxtLink to="/tickets/"
                                    :class="[$route.path === '/tickets/' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'rounded-md px-3 py-2 font-medium']">
                                    Тикеты
                                </NuxtLink>

                                <div v-if="isAdmin" class="relative">
                                    <button
                                        :class="[$route.path === '/users/' || $route.path === '/role/' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'rounded-md px-3 py-2 font-medium']"
                                        @click="toggleDropdown">
                                        Справочники
                                    </button>
                                    <div v-if="showDropdown" ref="dropdown"
                                        class="absolute z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5">
                                        <NuxtLink to="/users/" class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                            @click="closeDropdown">
                                            Пользователи
                                        </NuxtLink>
                                        <NuxtLink to="/role/" class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                            @click="closeDropdown">
                                            Роли
                                        </NuxtLink>
                                        <NuxtLink to="/statuses/"
                                            class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                            @click="closeDropdown">
                                            Статусы
                                        </NuxtLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="hidden md:block">
                        <div class="ml-4 flex items-center md:ml-6">
                            <div class="ml-3">
                                <div class="flex items-center gap-x-5">
                                    <div class="flex flex-col items-end">
                                        <p class="text-gray-200 font-medium">{{ userInfo.first_name + ' ' + userInfo.last_name }}</p>
                                        <button class="text-red-400 cursor-pointer hover:underline" @click="logout">Выйти</button>
                                    </div>
                                    <div class="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm"
                                        id="user-menu-button" aria-expanded="menuOpen" aria-haspopup="true">
                                        <img class="size-8 rounded-full"
                                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                            alt="">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    </header>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'nuxt/app';
import { useRouter } from 'nuxt/app';
import axios from 'axios';

const router = useRouter();

const route = useRoute();
const menuOpen = ref(false);
const showDropdown = ref(false);
const dropdown = ref(null);

const userRoles = ref([]);
const userInfo = ref([]);

function toggleMenu() {
    menuOpen.value = !menuOpen.value;
}

function toggleDropdown() {
    showDropdown.value = !showDropdown.value;
}

function closeDropdown() {
    showDropdown.value = false;
}

onMounted(async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return;
        }

        const response = await axios.get('https://nuxt.itpq.ru:3001/users/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        userRoles.value = response.data.roles;
        userInfo.value = response.data;
    } catch (error) {
        console.error(error);
    }
});

async function logout() {
  localStorage.removeItem('token');
  router.push('/auth/login');
}

const isAdmin = computed(() => {
    return userRoles.value.includes(7);
});
</script>