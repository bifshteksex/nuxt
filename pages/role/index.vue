<template>
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 dark:text-gray-200">
        <button @click="addNewRole"
            class="mt-4 bg-[#6366f1] hover:bg-[#595ab4] text-white font-bold py-2 px-4 mb-4 rounded cursor-pointer">
            + Добавить новую роль
        </button>

        <div v-if="roles.length > 0" class="flex flex-col">
            <div class="-m-1.5 overflow-x-auto">
                <div class="p-1.5 min-w-full inline-block align-middle">
                    <div
                        class="border border-gray-200 rounded-lg shadow-xs overflow-hidden dark:border-neutral-700 dark:shadow-gray-900">
                        <table class="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                            <thead>
                                <tr class="divide-x divide-gray-200 dark:divide-neutral-700">
                                    <th scope="col"
                                        class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
                                        Роль
                                    </th>
                                    <th scope="col"
                                        class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
                                        Описание
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
                                        <input v-model="newRole.name"
                                            class="w-full dark:text-gray-200 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-900 dark:border-gray-700 dark:placeholder-gray-500 dark:focus:ring-gray-600" />
                                    </td>
                                    <td
                                        class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                                        <input v-model="newRole.description"
                                            class="w-full dark:text-gray-200 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-900 dark:border-gray-700 dark:placeholder-gray-500 dark:focus:ring-gray-600" />
                                    </td>
                                    <td
                                        class="px-6 py-4 flex items-center gap-x-5 justify-end whitespace-nowrap text-end text-sm font-medium">
                                        <button @click="saveNewRole"
                                            class="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-hidden focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-[#6366f1] dark:hover:text-[#595ab4] dark:focus:text-[#595ab4] cursor-pointer">
                                            Сохранить
                                        </button>
                                        <button @click="cancelNewRole"
                                            class="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-red-600 hover:text-red-800 focus:outline-hidden focus:text-red-800 disabled:opacity-50 disabled:pointer-events-none dark:text-[#6366f1] dark:hover:text-[#595ab4] dark:focus:text-[#595ab4] cursor-pointer">
                                            Отменить
                                        </button>
                                    </td>
                                </tr>
                                <tr :data-key="role.id" v-for="role in roles" :key="role.id">
                                    <td
                                        class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                                        <span v-if="!role.isEditing">{{ role.name }}</span>
                                        <input v-else
                                            v-if="role.name !== 'admin' && role.name !== 'route' && role.name !== 'user' && role.name !== 'worker'"
                                            v-model="role.editingName"
                                            class="w-full dark:text-gray-200 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-900 dark:border-gray-700 dark:placeholder-gray-500 dark:focus:ring-gray-600" />
                                    </td>
                                    <td
                                        class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                                        <span v-if="!role.isEditing">{{ role.description }}</span>
                                        <input v-else v-model="role.editingDescription"
                                            class="w-full dark:text-gray-200 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-900 dark:border-gray-700 dark:placeholder-gray-500 dark:focus:ring-gray-600" />
                                    </td>
                                    <td
                                        class="px-6 py-4 flex items-center gap-x-5 justify-end whitespace-nowrap text-end text-sm font-medium">
                                        <button v-if="!role.isEditing" type="button"
                                            class="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-hidden focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-[#6366f1] dark:hover:text-[#595ab4] dark:focus:text-[#595ab4] cursor-pointer"
                                            @click="editRole(role)">
                                            Изменить
                                        </button>
                                        <div v-else>
                                            <button type="button"
                                                class="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-red-600 hover:text-red-800 focus:outline-hidden focus:text-red-800 disabled:opacity-50 disabled:pointer-events-none dark:text-[#6366f1] dark:hover:text-[#595ab4] dark:focus:text-[#595ab4] cursor-pointer"
                                                @click="cancelEdit(role)">
                                                Отменить
                                            </button>
                                        </div>
                                        <button
                                            v-if="role.name !== 'admin' && role.name !== 'route' && role.name !== 'user' && role.name !== 'worker'"
                                            type="button"
                                            class="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-hidden focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-[#6366f1] dark:hover:text-[#595ab4] dark:focus:text-[#595ab4] cursor-pointer"
                                            @click="deleteRole(role.id)">
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
        <button v-if="isAnyRoleEditing" @click="saveChanges"
            class="mt-4 bg-[#6366f1] hover:bg-[#595ab4] text-white font-bold py-2 px-4 rounded cursor-pointer">
            Сохранить
        </button>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'nuxt/app';
import axios from 'axios';

const roles = ref([]);
const router = useRouter();
const isAddingNew = ref(false);
const newRole = ref({ name: '', description: '' });

onMounted(async () => {
    await fetchRoles();
});

async function fetchRoles() {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:3000/roles', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        roles.value = response.data.map((role) => ({
            ...role,
            isEditing: false,
            editingName: role.name,
            editingDescription: role.description,
        }));
    } catch (error) {
        console.error(error);
    }
}

function editRole(role) {
    role.isEditing = true;
}

function cancelEdit(role) {
    role.isEditing = false;
    role.editingName = role.name;
    role.editingDescription = role.description;
}

async function saveRole(role) {
    try {
        const token = localStorage.getItem('token');
        await axios.put(`http://127.0.0.1:3000/roles/${role.id}`, { name: role.editingName, description: role.editingDescription }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        role.isEditing = false;
    } catch (error) {
        console.error(error);
    }
}

async function deleteRole(id) {
    try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://127.0.0.1:3000/roles/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        await fetchRoles();
    } catch (error) {
        console.error(error);
    }
}

const isAnyRoleEditing = computed(() => {
    return roles.value.some((role) => role.isEditing);
});

async function saveChanges() {
    const order = roles.value.map((role) => role.id); // Сохраняем текущий порядок
    const editedRoles = roles.value.filter((role) => role.isEditing);
    for (const role of editedRoles) {
        await saveRole(role);
    }
    await fetchRoles();
    reorderRoles(order); // Восстанавливаем порядок
}

function reorderRoles(order) {
    roles.value.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
}

function addNewRole() {
    isAddingNew.value = true;
}

async function saveNewRole() {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://127.0.0.1:3000/roles', { name: newRole.value.name, description: newRole.value.description }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        roles.value.push({ ...response.data, isEditing: false, editingName: response.data.name });
        isAddingNew.value = false;
        newRole.value.name = '';
        newRole.value.description = '';
        await fetchRoles();
    } catch (error) {
        console.error(error);
    }
}

function cancelNewRole() {
    isAddingNew.value = false;
    newRole.value.name = '';
    newRole.value.description = '';
}
</script>