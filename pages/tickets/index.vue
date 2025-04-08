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

        <div class="flex justify-between items-center mb-4 dark:text-gray-200">
            <div>
                Показать:
                <select v-model="pageSize"
                    class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                </select>
                элементов
            </div>

            <input v-model="searchQuery" type="text"
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                placeholder="Поиск по тикетам..." />
        </div>

        <div v-if="loading">
            <p class="dark:text-gray-300">Загрузка...</p>
        </div>
        <div class="flex flex-col gap-y-5" v-if="paginatedTickets.length > 0">
            <div v-for="ticket in paginatedTickets" :key="ticket.id" @click="editTicket(ticket.id)"
                class="border rounded p-4 hover:bg-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 transition duration-500 cursor-pointer">
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

        <nav v-if="totalPages > 1" class="flex items-center justify-center gap-x-1 mt-5" aria-label="Pagination">
            <button :disabled="currentPage === 1" @click="currentPage--" type="button"
                class="cursor-pointer min-h-9.5 min-w-9.5 py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10"
                aria-label="Previous">
                <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round">
                    <path d="m15 18-6-6 6-6"></path>
                </svg>
                <span>Назад</span>
            </button>
            <div class="flex items-center gap-x-1">
                <button v-for="page in visiblePages" :key="page" type="button"
                    class="cursor-pointer min-h-9.5 min-w-9.5 flex justify-center items-center py-2 px-3 text-sm rounded-lg focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none"
                    :class="{
                        'bg-gray-200 text-gray-800 focus:bg-gray-300 dark:bg-[#6366f1] dark:text-white dark:focus:bg-neutral-500': page === currentPage,
                        'text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10': page !== currentPage,
                    }" @click="goToPage(page)" :aria-current="page === currentPage ? 'page' : null">{{ page }}</button>
            </div>
            <button :disabled="currentPage === totalPages" @click="currentPage++" type="button"
                class="cursor-pointer min-h-9.5 min-w-9.5 py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10"
                aria-label="Next">
                <span>Вперед</span>
                <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round">
                    <path d="m9 18 6-6-6-6"></path>
                </svg>
            </button>
        </nav>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
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
const searchQuery = ref('');
const pageSize = ref(10); // Default page size
const currentPage = ref(1);
const paginationWindow = ref(3); // Number of page buttons to show around the current page

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
        let url = 'https://nuxt.itpq.ru:3001/tickets';
        let params = {};

        if (selectedStatus.value) {
            params.status_id = selectedStatus.value;
        }

        if (!isAdmin.value && !isRoute.value) {
            params.assigned_to = userId.value;
        }

        const response = await axios.get(url, { params: params });
        tickets.value = response.data;

        currentPage.value = 1; // Reset to first page after fetching/filtering
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
}

async function fetchStatuses() {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://nuxt.itpq.ru:3001/statuses', {
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
        await axios.delete(`https://nuxt.itpq.ru:3001/tickets/${id}`);
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

const filteredTickets = computed(() => {
    const query = searchQuery.value.toLowerCase();
    return tickets.value.filter(ticket => {
        return (
            ticket.title.toLowerCase().includes(query) ||
            ticket.description.toLowerCase().includes(query)
        );
    });
});

const totalPages = computed(() => {
    return Math.ceil(filteredTickets.value.length / pageSize.value);
});

const paginatedTickets = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize.value;
    const endIndex = startIndex + parseInt(pageSize.value, 10);
    return filteredTickets.value.slice(startIndex, endIndex);
});

const visiblePages = computed(() => {
    const pages = [];
    const startPage = Math.max(1, currentPage.value - Math.floor(paginationWindow.value / 2));
    const endPage = Math.min(totalPages.value, currentPage.value + Math.floor(paginationWindow.value / 2));

    if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
            pages.push('...');
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    if (endPage < totalPages.value) {
        if (endPage < totalPages.value - 1) {
            pages.push('...');
        }
        pages.push(totalPages.value);
    }

    return pages;
});

function goToPage(page) {
    if (typeof page === 'number') {
        currentPage.value = page;
    }
}

watch(searchQuery, () => {
    currentPage.value = 1; // Reset page on search
});

watch(pageSize, () => {
    currentPage.value = 1; // Reset page on page size change
});
</script>