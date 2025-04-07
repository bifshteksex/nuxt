<template>
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 dark:text-gray-200">
        <div v-if="users.length > 0" class="flex flex-col">
            <div class="-m-1.5 overflow-x-auto">
                <div class="p-1.5 min-w-full inline-block align-middle">
                    <div
                        class="border border-gray-200 rounded-lg shadow-xs overflow-hidden dark:border-neutral-700 dark:shadow-gray-900">
                        <table class="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                            <thead>
                                <tr class="divide-x divide-gray-200 dark:divide-neutral-700">
                                    <th scope="col"
                                        class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
                                        Имя
                                    </th>
                                    <th scope="col"
                                        class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
                                        Фамилия
                                    </th>
                                    <th scope="col"
                                        class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
                                        Email
                                    </th>
                                    <th scope="col"
                                        class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
                                        Роли
                                    </th>
                                    <th scope="col"
                                        class="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
                                        Действие
                                    </th>
                                </tr>
                            </thead>
                            <tbody id="dragg" class="divide-y divide-gray-200 dark:divide-neutral-700">
                                <tr :data-key="user.id" v-for="user in users" :key="user.id">
                                    <td
                                        class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                                        <span v-if="!user.isEditing">{{ user.first_name }}</span>
                                        <input v-else v-model="user.editingFirstName"
                                            class="w-full dark:text-gray-200 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-900 dark:border-gray-700 dark:placeholder-gray-500 dark:focus:ring-gray-600" />
                                    </td>
                                    <td
                                        class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                                        <span v-if="!user.isEditing">{{ user.last_name }}</span>
                                        <input v-else v-model="user.editingLastName"
                                            class="w-full dark:text-gray-200 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-900 dark:border-gray-700 dark:placeholder-gray-500 dark:focus:ring-gray-600" />
                                    </td>
                                    <td
                                        class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                                        <span v-if="!user.isEditing">{{ user.email }}</span>
                                        <input v-else v-model="user.editingEmail"
                                            class="w-full dark:text-gray-200 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-900 dark:border-gray-700 dark:placeholder-gray-500 dark:focus:ring-gray-600" />
                                    </td>
                                    <td
                                        class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                                        <span v-if="!user.isEditing">{{ getRoleNames(user.roles) }}</span>
                                        <div v-else class="w-64">
                                            <button @click="user.showRoles = !user.showRoles"
                                                class="w-full p-2 border rounded-md text-left focus:outline-none focus:ring focus:ring-blue-300">
                                                Выберите роли
                                            </button>
                                            <div v-if="user.showRoles"
                                                class="absolute mt-1 rounded-md shadow-lg bg-white dark:bg-gray-800 z-10">
                                                <ul class="divide-y divide-gray-200">
                                                    <li v-for="role in roles" :key="role.id"
                                                        class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                                        <label class="inline-flex items-center">
                                                            <input type="checkbox" :value="role.id"
                                                                v-model="user.selectedRoles"
                                                                class="form-checkbox rounded h-4 w-4 text-blue-600" />
                                                            <span class="ml-2">{{ role.name }}</span>
                                                        </label>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </td>

                                    <td
                                        class="px-6 py-4 flex items-center gap-x-5 justify-end whitespace-nowrap text-end text-sm font-medium">
                                        <button v-if="!user.isEditing" type="button"
                                            class="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-hidden focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-[#6366f1] dark:hover:text-[#595ab4] dark:focus:text-[#595ab4] cursor-pointer"
                                            @click="editUser(user)">
                                            Изменить
                                        </button>
                                        <div v-else>
                                            <button type="button"
                                                class="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-red-600 hover:text-red-800 focus:outline-hidden focus:text-red-800 disabled:opacity-50 disabled:pointer-events-none dark:text-[#6366f1] dark:hover:text-[#595ab4] dark:focus:text-[#595ab4] cursor-pointer"
                                                @click="cancelEdit(user)">
                                                Отменить
                                            </button>
                                        </div>
                                        <button type="button"
                                            class="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-hidden focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-[#6366f1] dark:hover:text-[#595ab4] dark:focus:text-[#595ab4] cursor-pointer"
                                            @click="deleteUser(user.id)">
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
        <button v-if="isAnyUserEditing" @click="saveChanges"
            class="mt-4 bg-[#6366f1] hover:bg-[#595ab4] text-white font-bold py-2 px-4 rounded cursor-pointer">
            Сохранить
        </button>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'nuxt/app';
import axios from 'axios';

const users = ref([]);
const roles = ref([]);

const router = useRouter();
const isAddingNew = ref(false);

onMounted(async () => {
    await fetchUsers();
    await fetchRoles();
});

async function fetchUsers() {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://nuxt.itpq.ru:3001/users', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        users.value = response.data.map((user) => ({
            ...user,
            isEditing: false,
            editingFirstName: user.first_name,
            editingLastName: user.last_name,
            editingEmail: user.email,
            showRoles: false,
            selectedRoles: user.roles ? user.roles : [],
        }));
    } catch (error) {
        console.error(error);
    }
}

async function fetchRoles() {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://nuxt.itpq.ru:3001/roles', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        roles.value = response.data;
    } catch (error) {
        console.error(error);
    }
}

function editUser(user) {
    user.isEditing = true;
}

function cancelEdit(user) {
    user.isEditing = false;
    user.editingFirstName = user.first_name;
    user.editingLastName = user.last_name;
    user.editingEmail = user.email;
}

async function saveUser(user) {
    try {
        const token = localStorage.getItem('token');
        await axios.put(`https://nuxt.itpq.ru:3001/users/${user.id}`, {
            first_name: user.editingFirstName,
            last_name: user.editingLastName,
            email: user.editingEmail,
            role_ids: user.selectedRoles,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        user.isEditing = false;
    } catch (error) {
        console.error(error);
    }
}

async function deleteUser(id) {
    try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://nuxt.itpq.ru:3001/users/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        await fetchUsers();
    } catch (error) {
        console.error(error);
    }
}

const isAnyUserEditing = computed(() => {
    return users.value.some((user) => user.isEditing);
});

async function saveChanges() {
    const order = users.value.map((user) => user.id);
    const editedUsers = users.value.filter((user) => user.isEditing);
    for (const user of editedUsers) {
        await saveUser(user);
    }
    await fetchUsers();
    reorderUsers(order);
}

function reorderUsers(order) {
    users.value.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
}

function getRoleNames(roleIds) {
    if (!roleIds || roleIds.length === 0) {
        return 'Нет ролей';
    }
    return roleIds.map(roleId => {
        const role = roles.value.find(r => r.id === roleId);
        return role ? role.name : 'Неизвестная роль';
    }).join(', ');
}
</script>