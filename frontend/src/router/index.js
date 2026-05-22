import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import {useAuthStore } from "@/stores/authStore.js";
import MealsView from "@/views/MealsView.vue";
import CreateEmployeeView from "@/views/CreateEmployeeView.vue";
import OrdersView from "@/views/OrdersView.vue";

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login, name: 'login' },
    { path: '/meals', component: MealsView, name: 'meals', meta: { requiresAuth: true } },
    { path: '/orders', component: OrdersView, name: 'orders', meta: { requiresAuth: true } },
    { path: '/employees/create', component: CreateEmployeeView, name: 'createEmployee', meta: { requiresAuth: true, requiresAdmin: true } }
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

    // manager verification
    if (to.meta.requiresManager && authStore.post !== 'admin' && authStore.post !== 'manager') {
        return '/login'
    }

    if (to.path === '/login' && !authStore.isTokenExpired) {
        return '/meals'
    }
})

export default router;