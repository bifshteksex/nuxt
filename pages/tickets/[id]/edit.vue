<template>
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 dark:text-gray-200">
        <div class="border rounded p-4 dark:bg-gray-800 dark:border-gray-700">
            <div class="flex gap-x-5 items-start justify-between">
                <div class="w-full">
                    <h2 v-if="!isEditing" class="text-2xl font-semibold dark:text-gray-200 mb-6">{{ ticketInfo.title }}
                    </h2>
                    <input v-else v-model="editingTitle"
                        class="w-full text-2xl font-semibold dark:text-gray-200 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-900 dark:border-gray-700 dark:placeholder-gray-500 dark:focus:ring-gray-600" />


                    <div v-if="!isEditing" class="min-w-40 flex items-center gap-x-1 my-2">
                        <div v-for="status in statuses" :key="status.id"
                            class="w-full h-2.5 flex flex-col justify-center overflow-hidden" :class="{
                                'bg-[#6366f1] text-xs text-white text-center whitespace-nowrap transition duration-500':
                                    getStatusPosition(ticketInfo.status_id) >= status.position,
                                'bg-gray-300 dark:bg-neutral-600': getStatusPosition(ticketInfo.status_id) < status.position,
                            }" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>

                    <p v-if="!isEditing" class="text-gray-600 dark:text-gray-400">{{ ticketInfo.description }}</p>
                    <textarea v-else v-model="editingDescription"
                        class="w-full text-gray-600 dark:text-gray-400 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-900 dark:border-gray-700 dark:placeholder-gray-500 dark:focus:ring-gray-600"></textarea>

                    <hr class="my-4 text-gray-400 opacity-50" />

                    <div class="flex items-center">
                        <p class="text-gray-600 dark:text-gray-400 mr-2">Приоритет: </p>
                        <select v-if="isEditing" v-model="selectedPriority"
                            class="border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-900 dark:border-gray-700 dark:placeholder-gray-500 dark:focus:ring-gray-600">
                            <option v-for="priority in priorities" :key="priority.id" :value="priority.id">
                                {{ priority.name }}
                            </option>
                        </select>
                        <span v-else :class="{
                            'text-green-400': ticketInfo.priority_id === 1,
                            'text-yellow-400': ticketInfo.priority_id === 2,
                            'text-red-400': ticketInfo.priority_id === 3,
                        }">
                            {{ getPriorityName(ticketInfo.priority_id) }}
                        </span>
                    </div>

                    <div class="flex items-center">
                        <p class="text-gray-600 dark:text-gray-400 mr-2">Статус: </p>
                        <select v-if="isEditing" v-model="selectedStatus"
                            class="border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-900 dark:border-gray-700 dark:placeholder-gray-500 dark:focus:ring-gray-600">
                            <option v-for="status in statuses" :key="status.id" :value="status.id">
                                {{ status.name }}
                            </option>
                        </select>
                        <span v-else>{{ getStatusName(ticketInfo.status_id) }}</span>
                    </div>

                    <p v-if="!isEditing" class="text-gray-600 dark:text-gray-400">Инициатор: <span class="text-white">{{
                        createdByName
                            }}</span>
                    </p>

                    <div class="flex items-center">
                        <p class="text-gray-600 dark:text-gray-400 mr-2">Ответственный: </p>
                        <select v-if="isEditing" v-model="selectedUser"
                            class="border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-900 dark:border-gray-700 dark:placeholder-gray-500 dark:focus:ring-gray-600">
                            <option v-for="user in users" :key="user.id" :value="user.id">
                                {{ user.first_name + ' ' + user.last_name }}
                            </option>
                        </select>
                        <span v-else>{{ assignedToName }}</span>
                    </div>

                    <p v-if="!isEditing" class="text-gray-600 dark:text-gray-400">Комментариев: <span
                            class="text-white">{{ comments.length }}</span></p>
                    <p v-if="!isEditing" class="text-gray-600 dark:text-gray-400">Обновлено: {{
                        formatDateTime(ticketInfo.updated_at) }}
                    </p>

                    <div v-if="isWorker && ticketInfo.status_id !== 3" class="flex items-center gap-x-5 mt-5">
                        <button v-if="ticketInfo.status_id !== 2"
                            class="cursor-pointer bg-[#6366f1] hover:bg-[#595ab4] text-white font-bold py-2 px-4 rounded"
                            @click="changeStatus(2)">
                            Взять в работу
                        </button>
                        <button v-else
                            class="cursor-pointer bg-[#6366f1] hover:bg-[#595ab4] text-white font-bold py-2 px-4 rounded"
                            @click="changeStatus(3)">
                            Завершить
                        </button>

                        <button v-if="ticketInfo.status_id !== 4"
                            class="cursor-pointer text-[#6366f1] hover:text-[#595ab4] font-bold py-2 px-4 rounded"
                            @click="changeStatus(4)">
                            Отложить
                        </button>
                    </div>
                </div>
                <div class="flex items-center gap-x-3">
                    <div v-if="isAdmin || isRoute">
                        <button v-if="!isEditing"
                            class="text-white mr-2 cursor-pointer rounded-full hover:bg-[#99a1af66] w-10 h-10 flex items-center justify-center"
                            @click="editTicket(id)">
                            <Icon name="mdi:lead-pencil" size="2em"
                                class="light:text-gray-800 dark:text-white transition-colors duration-300" />
                        </button>
                        <button v-else @click="saveTicket"
                            class="text-white mr-2 cursor-pointer rounded-full hover:bg-[#99a1af66] w-10 h-10 flex items-center justify-center">
                            <Icon name="mdi:content-save-check" size="2em"
                                class="light:text-gray-800 dark:text-white transition-colors duration-300" />
                        </button>
                    </div>

                    <button v-if="isAdmin"
                        class="text-white cursor-pointer rounded-full hover:bg-[#99a1af66] w-10 h-10 flex items-center justify-center"
                        @click="deleteTicket(id)">
                        <Icon name="mdi:delete" size="2em"
                            class="light:text-gray-800 dark:text-white transition-colors duration-300" />
                    </button>
                </div>
            </div>

            <!-- Chat Bubble -->
            <ul v-if="comments.length > 0 && !isEditing" class="space-y-5 mt-10">
                <li v-for="comment in comments" :key="comment.id" class="max-w-lg flex gap-x-2 sm:gap-x-4 me-11">
                    <img class="inline-block size-9 rounded-full"
                        src=""
                        alt="Картиночка">

                    <!-- Card -->
                    <div
                        class="bg-white border border-gray-200 rounded-2xl p-4 space-y-3 dark:bg-gray-900 dark:border-gray-700 text-sm text-gray-800 dark:text-white">
                        <h2 class="font-medium">{{ getUserName(comment.user_id) }}</h2>
                        <p>{{ comment.content }}</p>
                    </div>
                    <!-- End Card -->
                </li>
            </ul>
            <!-- End Chat Bubble -->

            <div v-if="!isEditing" class="relative mt-10">
                <textarea v-model="commentText" id="hs-textarea-ex-1"
                    class="p-3 sm:p-4 pb-12 sm:pb-12 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:placeholder-gray-500 dark:focus:ring-gray-600"
                    placeholder="Комментарий" data-hs-textarea-auto-height=""></textarea>

                <div class="absolute bottom-px inset-x-px p-2 rounded-b-md bg-white dark:bg-gray-900">
                    <div class="flex flex-wrap justify-end items-center gap-2">
                        <div class="flex items-center gap-x-1">
                            <button type="button" :disabled="isCommentEmpty"
                                class="inline-flex shrink-0 justify-center items-center size-8 rounded-lg text-white bg-[#6366f1] hover:bg-[#595ab4] focus:z-10 focus:outline-hidden focus:bg-[#6366f1] cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                                @click="sendComment">
                                <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                    fill="currentColor" viewBox="0 0 16 16">
                                    <path
                                        d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z">
                                    </path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'nuxt/app';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const ticketInfo = ref([]);

const commentText = ref('');

const router = useRouter();
const route = useRoute();

const comments = ref([]);
const userNames = ref({});

const statuses = ref([]);
const priorities = ref([]);
const selectedPriority = ref(null);
const selectedStatus = ref(null);

const users = ref([]);
const selectedUser = ref(null);

const userRoles = ref('');

// Режим редактирования
const isEditing = ref(false);
const editingTitle = ref('');
const editingDescription = ref('');

const createdByName = ref('Не назначен');
const assignedToName = ref('Не назначен');

const isCommentEmpty = computed(() => {
    return !commentText.value.trim();
});

const getUserName = computed(() => {
    return (userId) => {
        if (userNames.value[userId]) {
            return userNames.value[userId];
        } else {
            fetchUser(userId).then(name => {
                userNames.value[userId] = name;
            });
            return 'Загрузка...';
        }
    };
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

function getPriorityName(priorityId) {
    const priority = priorities.value.find(p => p.id === priorityId);
    return priority ? priority.name : 'Неизвестно';
}

function getStatusName(statusId) {
    const status = statuses.value.find(p => p.id === statusId);
    return status ? status.name : 'Неизвестно';
}

async function fetchCreatedByName(created_by_Id) {
    if (created_by_Id) {
        createdByName.value = await fetchUser(created_by_Id);
    }
}

async function fetchAssignedToName(assigned_to) {
    if (assigned_to) {
        assignedToName.value = await fetchUser(assigned_to);
    }
}

function editTicket() {
    isEditing.value = true;
    editingTitle.value = ticketInfo.value.title;
    editingDescription.value = ticketInfo.value.description;
}

function formatDateTime(dateTimeString) {
    if (!dateTimeString) {
        return 'Неизвестно';
    }

    const date = new Date(dateTimeString);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    };
    return date.toLocaleDateString('ru-RU', options);
}

async function fetchTicket() {
    try {
        const response = await axios.get(`/api/tickets/${route.params.id}`);
        ticketInfo.value = response.data;
        selectedUser.value = response.data.assigned_to;
        selectedStatus.value = response.data.status_id;
        selectedPriority.value = response.data.priority_id;
    } catch (error) {
        console.error(error);
    }
}

async function fetchComments() {
    try {
        const response = await axios.get(`/api/tickets/${route.params.id}/comments/`);
        comments.value = response.data;
    } catch (error) {
        console.error(error);
    }
}

async function fetchUser(userId) {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.first_name + ' ' + response.data.last_name;
    } catch (error) {
        console.error(error);
        return 'Неизвестный пользователь'; // Возвращаем значение по умолчанию
    }
}

async function fetchAllUsers() {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/users/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        users.value = response.data;
    } catch (error) {
        console.error(error);
        return 'Неизвестный пользователь'; // Возвращаем значение по умолчанию
    }
}

async function fetchPriorities() {
    try {
        const response = await axios.get('/api/priorities');
        priorities.value = response.data;
    } catch (error) {
        console.error(error);
    }
}

async function fetchStatuses() {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/statuses', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        statuses.value = response.data.sort((a, b) => a.position - b.position);
    } catch (error) {
        console.error(error);
    }
}

async function saveTicket() {
    try {
        await axios.put(`/api/tickets/${route.params.id}`, {
            title: editingTitle.value,
            description: editingDescription.value,
            priority_id: selectedPriority.value,
            status_id: selectedStatus.value,
            assigned_to: selectedUser.value
        });

        ticketInfo.value.title = editingTitle.value;
        ticketInfo.value.description = editingDescription.value;
        ticketInfo.value.priority_id = selectedPriority.value;
        ticketInfo.value.status_id = selectedStatus.value;
        ticketInfo.value.assigned_to = selectedUser.value;

        await fetchCreatedByName(ticketInfo.value.created_by);
        await fetchAssignedToName(ticketInfo.value.assigned_to);

        isEditing.value = false;
    } catch (error) {
        console.error(error);
    }
}

async function changeStatus(statusId) {
    try {
        await axios.put(`/api/tickets/${route.params.id}`, {
            status_id: statusId,
        });
        ticketInfo.value.status_id = statusId;
    } catch (error) {
        console.error(error);
    }
}

async function sendComment() {
    try {
        const userId = getUserIdFromToken();
        if (!userId) {
            console.error('Пользователь не авторизован');
            return;
        }

        const token = localStorage.getItem('token');
        const response = await axios.post(
            `/api/tickets/${route.params.id}/comments`,
            {
                userId: userId,
                content: commentText.value,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        comments.value.push(response.data);
        commentText.value = '';
    } catch (error) {
        console.error(error);
    }
}


function getStatusPosition(statusId) {
    const status = statuses.value.find((s) => s.id === statusId);
    return status ? status.position : -1;
}

const isAdmin = computed(() => {
    return userRoles.value.includes(7);
});

const isRoute = computed(() => {
    return userRoles.value.includes(8);
});

const isWorker = computed(() => {
    return userRoles.value.includes(29);
});

onMounted(async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return;
        }

        const response = await axios.get('/api/users/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        userRoles.value = response.data.roles;
    } catch (error) {
        console.error(error);
    }

    await fetchTicket();
    await fetchComments();
    await fetchPriorities();
    await fetchAllUsers();
    await fetchStatuses();

    if (ticketInfo.value.created_by) {
        await fetchCreatedByName(ticketInfo.value.created_by);
    }

    if (ticketInfo.value.assigned_to) {
        await fetchAssignedToName(ticketInfo.value.assigned_to);
    }
});
</script>