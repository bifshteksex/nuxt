<template>
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center my-4">
            <div v-if="statuses.length > 0" class="flex">
                <div
                    class="flex bg-gray-100 dark:bg-gray-700 hover:dark:bg-gray-600 hover:bg-gray-200 rounded-lg transition p-1">
                    <nav class="flex gap-x-2">
                        <a class="cursor-pointer py-3 px-4 inline-flex items-center gap-2 text-gray-700 font-medium rounded-lg shadow-2xs focus:outline-hidden hover:hover:text-[#6366f1] focus:hover:text-[#6366f1] dark:text-neutral-400"
                            href="#" aria-current="page" @click="selectedStatus = null; fetchTickets()"
                            :class="{ 'dark:bg-gray-800 dark:text-neutral-400': selectedStatus === null }">
                            Все
                        </a>
                        <a v-for="status in statuses" :key="status.id"
                            class="cursor-pointer py-3 px-4 inline-flex items-center gap-2 text-gray-700 font-medium rounded-lg shadow-2xs focus:outline-hidden hover:hover:text-[#6366f1] focus:hover:text-[#6366f1] dark:text-neutral-400"
                            @click="selectedStatus = status.id; fetchTickets()"
                            :class="{ 'dark:bg-gray-800': selectedStatus === status.id }">
                            {{ status.name }}
                        </a>
                    </nav>
                </div>
            </div>
            <button v-if="!loading"
                class="cursor-pointer bg-[#6366f1] hover:bg-[#595ab4] text-white font-bold py-2 px-4 rounded"
                @click="addTicket">
                + Создать тикет
            </button>
        </div>

        <div v-if="loading">
            <p class="dark:text-gray-300">Загрузка...</p>
        </div>
        <div v-if="tickets.length > 0">
            <div v-for="ticket in tickets" :key="ticket.id" @click="editTicket(ticket.id)"
                class="border rounded p-4 mb-4 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-700 transition duration-500 cursor-pointer">
                <div class="flex gap-x-5 items-start justify-between">
                    <div class="w-full">
                        <h2 class="text-2xl font-semibold dark:text-gray-200 mb-6">{{ ticket.title }}</h2>

                        <div class="min-w-40 flex items-center gap-x-1 my-2">
                            <div v-for="status in statuses" :key="status.id"
                                class="w-full h-2.5 flex flex-col justify-center overflow-hidden" :class="{
                                    'bg-[#6366f1] text-xs text-white text-center whitespace-nowrap transition duration-500':
                                        getStatusPosition(ticket.status_id) >= status.position,
                                    'bg-gray-300 dark:bg-neutral-600': getStatusPosition(ticket.status_id) < status.position,
                                }" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <p class="text-gray-600 dark:text-gray-400">{{ ticket.description }}</p>
                    </div>
                    <div v-if="isAdmin" class="flex items-center gap-x-3">
                        <button @click.stop="deleteTicket(ticket.id)"
                            class="text-white cursor-pointer rounded-full hover:bg-[#99a1af66] w-10 h-10 flex items-center justify-center">
                            <Icon name="mdi:delete" size="2em"
                                class="light:text-gray-800 dark:text-white transition-colors duration-300" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <p v-else class="text-gray-600 dark:text-gray-400">Нет тикетов.</p>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'nuxt/app';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const tickets = ref([]);
const statuses = ref([]);
const loading = ref(true);
const router = useRouter();
const userRoles = ref('');
const selectedStatus = ref(null);
const userId = ref(null);

onMounted(async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return;
        }

        const response = await axios.get('http://127.0.0.1:3000/users/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        userRoles.value = response.data.roles;
    } catch (error) {
        console.error(error);
    }

    userId.value = getUserIdFromToken();
    await fetchTickets();
    await fetchStatuses();
});

async function fetchTickets() {
    loading.value = true;
    try {
        let url = 'http://127.0.0.1:3000/tickets';
        let params = {};

        if (selectedStatus.value) {
            params.status_id = selectedStatus.value;
        }
        
        if (!isAdmin.value && !isRoute.value) {
            params.assigned_to = userId.value;
        }

        const response = await axios.get(url, { params: params });
        tickets.value = response.data;
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
}

async function fetchStatuses() {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:3000/statuses', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        statuses.value = response.data.sort((a, b) => a.position - b.position);
    } catch (error) {
        console.error(error);
    }
}

async function deleteTicket(id) {
    try {
        await axios.delete(`http://127.0.0.1:3000/tickets/${id}`);
        await fetchTickets();
    } catch (error) {
        console.error(error);
    }
}

function addTicket() {
    router.push('/tickets/add');
}

function editTicket(id) {
    router.push(`/tickets/${id}/edit`);
}

const isAdmin = computed(() => {
    return userRoles.value.includes(7);
});

const isRoute = computed(() => {
    return userRoles.value.includes(8);
});

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

function getStatusPosition(statusId) {
    const status = statuses.value.find((s) => s.id === statusId);
    return status ? status.position : -1;
}
</script>