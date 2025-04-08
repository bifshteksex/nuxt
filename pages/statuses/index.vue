<template>
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 dark:text-gray-200">
        <div class="flex justify-between items-center mb-4">
            <button @click="addNewStatus"
                class="bg-[#6366f1] hover:bg-[#595ab4] text-white font-bold py-2 px-4 rounded cursor-pointer">
                + Добавить новый статус
            </button>
        </div>

        <div class="flex justify-between items-center mb-4">
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
                placeholder="Поиск по всем полям..." />
        </div>

        <div v-if="paginatedStatuses.length > 0" class="flex flex-col">
            <div class="-m-1.5 overflow-x-auto">
                <div class="p-1.5 min-w-full inline-block align-middle">
                    <div
                        class="border border-gray-200 rounded-lg shadow-xs overflow-hidden dark:border-neutral-700 dark:shadow-gray-900">
                        <table class="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                            <thead>
                                <tr class="divide-x divide-gray-200 dark:divide-neutral-700">
                                    <th scope="col"
                                        class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
                                        Статус
                                    </th>
                                    <th scope="col"
                                        class="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
                                        Действие
                                    </th>
                                </tr>
                            </thead>
                            <tbody id="dragg" class="divide-y divide-gray-200 dark:divide-neutral-700">
                                <tr v-if="isAddingNew">
                                    <td
                                        class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                                        <input v-model="newStatus.name"
                                            class="w-full dark:text-gray-200 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-900 dark:border-gray-700 dark:placeholder-gray-500 dark:focus:ring-gray-600" />
                                    </td>
                                    <td
                                        class="px-6 py-4 flex items-center gap-x-5 justify-end whitespace-nowrap text-end text-sm font-medium">
                                        <button @click="saveNewStatus"
                                            class="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-hidden focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-[#6366f1] dark:hover:text-[#595ab4] dark:focus:text-[#595ab4] cursor-pointer">
                                            Сохранить
                                        </button>
                                        <button @click="cancelNewStatus"
                                            class="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-red-600 hover:text-red-800 focus:outline-hidden focus:text-red-800 disabled:opacity-50 disabled:pointer-events-none dark:text-[#6366f1] dark:hover:text-[#595ab4] dark:focus:text-[#595ab4] cursor-pointer">
                                            Отменить
                                        </button>
                                    </td>
                                </tr>
                                <tr :data-key="status.id" v-for="status in paginatedStatuses" :key="status.id">
                                    <td
                                        class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                                        <span v-if="!status.isEditing">{{ status.name }}</span>
                                        <input v-else v-model="status.editingName"
                                            class="w-full dark:text-gray-200 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-900 dark:border-gray-700 dark:placeholder-gray-500 dark:focus:ring-gray-600" />
                                    </td>
                                    <td
                                        class="px-6 py-4 flex items-center gap-x-5 justify-end whitespace-nowrap text-end text-sm font-medium">
                                        <button v-if="!status.isEditing" type="button"
                                            class="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-hidden focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-[#6366f1] dark:hover:text-[#595ab4] dark:focus:text-[#595ab4] cursor-pointer"
                                            @click="editStatus(status)">
                                            Изменить
                                        </button>
                                        <div v-else>
                                            <button type="button"
                                                class="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-red-600 hover:text-red-800 focus:outline-hidden focus:text-red-800 disabled:opacity-50 disabled:pointer-events-none dark:text-[#6366f1] dark:hover:text-[#595ab4] dark:focus:text-[#595ab4] cursor-pointer"
                                                @click="cancelEdit(status)">
                                                Отменить
                                            </button>
                                        </div>
                                        <button type="button"
                                            class="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-hidden focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-[#6366f1] dark:hover:text-[#595ab4] dark:focus:text-[#595ab4] cursor-pointer"
                                            @click="deleteStatus(status.id)">
                                            Удалить
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
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
        <button v-if="orderChanged || isAnyStatusEditing" @click="saveChanges"
            class="mt-4 bg-[#6366f1] hover:bg-[#595ab4] text-white font-bold py-2 px-4 rounded cursor-pointer">
            Сохранить
        </button>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'nuxt/app';
import axios from 'axios';
import Sortable from 'sortablejs';

const statuses = ref([]);
const router = useRouter();
const orderChanged = ref(false);
const isAddingNew = ref(false);
const newStatus = ref({ name: '' });
const searchQuery = ref('');
const pageSize = ref(10); // Default page size
const currentPage = ref(1);
const paginationWindow = ref(3); // Number of page buttons to show around the current page

onMounted(async () => {
    await fetchStatuses();
    if (process.client) {
        const sortable = document.querySelector('#dragg');
        new Sortable(sortable, {
            animation: 150,
            dragClass: 'rounded-none!',
            onEnd: () => {
                orderChanged.value = true;
            },
        });
    }
});

async function fetchStatuses() {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://nuxt.itpq.ru:3001/statuses', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        statuses.value = response.data.sort((a, b) => a.position - b.position).map((status) => ({
            ...status,
            isEditing: false,
            editingName: status.name,
        }));
        currentPage.value = 1; // Reset to first page after fetching/filtering
    } catch (error) {
        console.error(error);
    }
}

async function saveOrder() {
    try {
        const token = localStorage.getItem('token');
        const dragg = document.querySelector('#dragg');
        const rows = dragg.querySelectorAll('tr');

        const order = Array.from(rows).map((row) => {
            const key = parseInt(row.dataset.key, 10);
            return key;
        });

        await axios.put('https://nuxt.itpq.ru:3001/statuses/position', { order }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        orderChanged.value = false;
    } catch (error) {
        console.error(error);
    }
}

function editStatus(status) {
    status.isEditing = true;
}

function cancelEdit(status) {
    status.isEditing = false;
    status.editingName = status.name;
}

async function saveStatus(status) {
    try {
        const token = localStorage.getItem('token');
        await axios.put(`https://nuxt.itpq.ru:3001/statuses/${status.id}`, { name: status.editingName }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        status.isEditing = false;
    } catch (error) {
        console.error(error);
    }
}

async function deleteStatus(id) {
    try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://nuxt.itpq.ru:3001/statuses/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        await fetchStatuses();
    } catch (error) {
        console.error(error);
    }
}

const isAnyStatusEditing = computed(() => {
    return statuses.value.some((status) => status.isEditing);
});

async function saveChanges() {
    await saveOrder();

    const editedStatuses = statuses.value.filter((status) => status.isEditing);
    for (const status of editedStatuses) {
        await saveStatus(status);
    }

    await fetchStatuses();
}

function addNewStatus() {
    isAddingNew.value = true;
}

async function saveNewStatus() {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post('https://nuxt.itpq.ru:3001/statuses', { name: newStatus.value.name }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        statuses.value.push({ ...response.data, isEditing: false, editingName: response.data.name });
        isAddingNew.value = false;
        newStatus.value.name = '';
        await fetchStatuses();
    } catch (error) {
        console.error(error);
    }
}

function cancelNewStatus() {
    isAddingNew.value = false;
    newStatus.value.name = '';
}

const filteredStatuses = computed(() => {
    const query = searchQuery.value.toLowerCase();
    return statuses.value.filter(status => {
        return (
            status.name.toLowerCase().includes(query)
        );
    });
});

const totalPages = computed(() => {
    return Math.ceil(filteredStatuses.value.length / pageSize.value);
});

const paginatedStatuses = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize.value;
    const endIndex = startIndex + parseInt(pageSize.value, 10);
    return filteredStatuses.value.slice(startIndex, endIndex);
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