<template>
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 dark:text-gray-200">
        <button @click="addNewStatus"
            class="mt-4 bg-[#6366f1] hover:bg-[#595ab4] text-white font-bold py-2 px-4 mb-4 rounded cursor-pointer">
            + Добавить новый статус
        </button>

        <div v-if="statuses.length > 0" class="flex flex-col">
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
                                <tr :data-key="status.id" v-for="status in statuses" :key="status.id">
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
        <button v-if="orderChanged || isAnyStatusEditing" @click="saveChanges"
            class="mt-4 bg-[#6366f1] hover:bg-[#595ab4] text-white font-bold py-2 px-4 rounded cursor-pointer">
            Сохранить
        </button>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'nuxt/app';
import axios from 'axios';
import Sortable from 'sortablejs';

const statuses = ref([]);
const router = useRouter();
const orderChanged = ref(false);
const isAddingNew = ref(false);
const newStatus = ref({ name: '' });

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
</script>