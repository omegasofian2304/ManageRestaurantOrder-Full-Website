<script setup>
/*
Author : Sofian Hussein, Léo del Duca, Milo Soupper, Rodrigo Silva Riço
Date : 20.05.2026
Title : Header.vue
Desc : Navigation header with links to all views
*/

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

defineProps({
  currentPage: {
    type: Number,
    default: 1,
  },
})

const router = useRouter()
const authStore = useAuthStore()
const userName = ref('...')

onMounted(async () => {
  if (!authStore.id || !authStore.accessToken) return

  const res = await fetch(`http://localhost:3000/employees/${authStore.id}`, {
    headers: { Authorization: `Bearer ${authStore.accessToken}` },
  })

  if (res.ok) {
    const data = await res.json()
    userName.value = `${data.first_name} ${data.last_name}`
  }
})

function navigateTo(page) {
  const routes = {
    1: '/orders/new',
    2: '/orders',
    3: '/meals',
    4: '/employees',
  }
  if (routes[page]) router.push(routes[page])
}
</script>

<template>
  <div class="max-lg:collapse bg-base-200 lg:mb-48 shadow-sm w-full rounded-md">
    <input id="navbar-1-toggle" class="peer hidden" type="checkbox" />
    <label for="navbar-1-toggle" class="fixed inset-0 hidden max-lg:peer-checked:block"></label>

    <div class="collapse-title navbar">
      <div class="navbar-start">
        <label for="navbar-1-toggle" class="btn btn-ghost lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
        </label>
        <button class="btn btn-ghost text-xl">Manage Restaurant Order</button>
      </div>

      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1">
          <li>
            <button
                @click="navigateTo(1)"
                :style="{
                color: currentPage === 1 ? 'orange' : '',
                textDecoration: currentPage === 1 ? 'underline' : '',
              }"
            >
              Nouvelle commande
            </button>
          </li>
          <li>
            <button
                @click="navigateTo(2)"
                :style="{
                color: currentPage === 2 ? 'orange' : '',
                textDecoration: currentPage === 2 ? 'underline' : '',
              }"
            >
              Commandes
            </button>
          </li>
          <li>
            <button
                @click="navigateTo(3)"
                :style="{
                color: currentPage === 3 ? 'orange' : '',
                textDecoration: currentPage === 3 ? 'underline' : '',
              }"
            >
              Menu
            </button>
          </li>
          <li>
            <button
                @click="navigateTo(4)"
                :style="{
                color: currentPage === 4 ? 'orange' : '',
                textDecoration: currentPage === 4 ? 'underline' : '',
              }"
            >
              Équipe
            </button>
          </li>
        </ul>
      </div>

      <div class="navbar-end">
        <button class="badge badge-info">
          <svg class="size-[1em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g fill="currentColor" stroke-linejoin="miter" stroke-linecap="butt">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></circle>
              <path d="m12,17v-5.5c0-.276-.224-.5-.5-.5h-1.5" fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></path>
              <circle cx="12" cy="7.25" r="1.25" fill="currentColor" stroke-width="2"></circle>
            </g>
          </svg>
          {{ userName }}
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <div class="collapse-content lg:hidden z-1">
      <ul class="menu">
        <li>
          <button
              @click="navigateTo(1)"
              :style="{
              color: currentPage === 1 ? 'orange' : '',
              textDecoration: currentPage === 1 ? 'underline' : '',
            }"
          >
            Nouvelle commande
          </button>
        </li>
        <li>
          <button
              @click="navigateTo(2)"
              :style="{
              color: currentPage === 2 ? 'orange' : '',
              textDecoration: currentPage === 2 ? 'underline' : '',
            }"
          >
            Commandes
          </button>
        </li>
        <li>
          <button
              @click="navigateTo(3)"
              :style="{
              color: currentPage === 3 ? 'orange' : '',
              textDecoration: currentPage === 3 ? 'underline' : '',
            }"
          >
            Menu
          </button>
        </li>
        <li>
          <button
              @click="navigateTo(4)"
              :style="{
              color: currentPage === 4 ? 'orange' : '',
              textDecoration: currentPage === 4 ? 'underline' : '',
            }"
          >
            Équipe
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>