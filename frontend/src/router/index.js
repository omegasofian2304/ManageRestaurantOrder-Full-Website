import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/login.vue';
import {useAuthStore } from "@/stores/authStore.js";

const routes = [
    { path: '/login', component: Login, name: 'login' }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach(async (to) => {
    const authStore = useAuthStore()

    if (to.meta.requiresAuth) {
        if (authStore.isTokenExpired) {
            return '/login'
        }
    }

    // admin verification
    if (to.meta.requiresAdmin && authStore.post !== 'admin') {
        return '/login'
    }

    // admin verification
    if (to.meta.requiresManager && authStore.post !== 'admin' && authStore.post !== 'manager') {
        return '/login'
    }

    if (to.path === '/login' && !authStore.isTokenExpired) {
        return '/home'
    }
})

export default router;