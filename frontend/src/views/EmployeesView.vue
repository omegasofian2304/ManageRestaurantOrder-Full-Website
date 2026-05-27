<script setup>
/*
Author : Sofian Hussein, Léo del Duca, Milo Soupper, Rodrigo Silva Riço
Date : 22.05.2026
Title : EmployeesView.vue
Desc : List of all employees with filters and search
*/

import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
import { useAuthStore } from '../stores/authStore'
import { getAllEmployeesService } from '../services/employeeService'
import Header from '../components/Header.vue'

const authStore = useAuthStore()

//state
const employees = ref([])
const isLoading = ref(true)
const errorMessage = ref(null)
const activeFilter = ref('tous')
const searchQuery = ref('')
const sortOrder = ref('asc')

// lifecycle
onMounted(async () => {
  try {
    employees.value = await getAllEmployeesService(authStore.accessToken)
  } catch (error) {
    if (error.status === 403) {
      errorMessage.value = "Accès refusé. Vous n'avez pas les droits nécessaires."
    } else {
      errorMessage.value = "Impossible de charger les employés. Veuillez réessayer."
    }
  } finally {
    isLoading.value = false
  }
})

// computed
const stats = computed(() => {
  const total = employees.value.length
  const employeeCount = employees.value.filter(e => e.post === 'employee').length
  const managerCount = employees.value.filter(e => e.post === 'manager').length
  const adminCount = employees.value.filter(e => e.post === 'admin').length
  return { total, employeeCount, managerCount, adminCount }
})

const filteredEmployees = computed(() => {
  let result = [...employees.value]

  if (activeFilter.value !== 'tous') {
    result = result.filter(e => e.post === activeFilter.value)
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
        e =>
            `${e.first_name} ${e.last_name}`.toLowerCase().includes(query) ||
            e.email.toLowerCase().includes(query)
    )
  }

  result.sort((a, b) => {
    const nameA = `${a.first_name} ${a.last_name}`.toLowerCase()
    const nameB = `${b.first_name} ${b.last_name}`.toLowerCase()
    return sortOrder.value === 'asc'
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA)
  })

  return result
})

const isAdmin = computed(() => authStore.post === 'admin')

// to get the initals for an employee
function getInitials(firstName, lastName) {
  return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase()
}

//different profile picture colors depending on the roles
function getAvatarColor(post) {
  if (post === 'admin')   return 'bg-orange-500 text-white'
  if (post === 'manager') return 'bg-orange-300 text-white'
  return 'bg-blue-400 text-white'
}

//different colors for different roles
function getRoleBadgeClass(post) {
  switch (post) {
    case 'admin':    return 'text-orange-500 font-semibold'
    case 'manager':  return 'text-orange-400 font-semibold'
    case 'employee': return 'text-blue-500 font-semibold'
    default:         return 'text-gray-500'
  }
}

//date format for when we will add users
function formatDate(dateString) {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}


// to sort by name ascending or descending
function toggleSort() {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}
</script>

<template>
  <Header />
  <div class="min-h-screen bg-gray-50">

    <main class="max-w-7xl mx-auto px-6 py-10">

      <!-- Page header -->
      <div class="flex items-start justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Équipe</h1>
          <p class="text-gray-500 mt-1 text-sm">Comptes des employés et gestion des rôles.</p>
        </div>
        <button
            v-if="isAdmin"
            @click="router.push('/employees/create')"
            class="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
        >
          <span class="text-lg leading-none">+</span>
          Inviter un employé
        </button>
      </div>

      <!-- Error state -->
      <div
          v-if="errorMessage"
          class="bg-red-50 border border-red-200 text-red-700 rounded-lg px-5 py-4 mb-6 text-sm"
      >
        {{ errorMessage }}
      </div>

      <!-- Stats cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8" v-if="!isLoading && !errorMessage">
        <div class="bg-white rounded-xl border border-gray-200 px-5 py-4">
          <p class="text-xs text-gray-400 mb-1">Employés actifs</p>
          <p class="text-2xl font-bold text-blue-500">{{ stats.total }}</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 px-5 py-4">
          <p class="text-xs text-gray-400 mb-1">Employees</p>
          <p class="text-2xl font-bold text-blue-500">{{ stats.employeeCount }}</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 px-5 py-4">
          <p class="text-xs text-gray-400 mb-1">Managers</p>
          <p class="text-2xl font-bold text-orange-400">{{ stats.managerCount }}</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 px-5 py-4">
          <p class="text-xs text-gray-400 mb-1">Admins</p>
          <p class="text-2xl font-bold text-orange-500">{{ stats.adminCount }}</p>
        </div>
      </div>

      <!-- Filters + Search -->
      <div class="flex flex-wrap items-center justify-between gap-4 mb-4" v-if="!isLoading && !errorMessage">
        <div class="flex items-center gap-2">
          <button
              @click="activeFilter = 'tous'"
              :class="activeFilter === 'tous'
              ? 'bg-orange-500 text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'"
              class="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
          >
            Tous
          </button>
          <button
              @click="activeFilter = 'employee'"
              :class="activeFilter === 'employee'
              ? 'bg-orange-500 text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'"
              class="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
          >
            Employees
          </button>
          <button
              @click="activeFilter = 'manager'"
              :class="activeFilter === 'manager'
              ? 'bg-orange-500 text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'"
              class="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
          >
            Managers
          </button>
          <button
              @click="activeFilter = 'admin'"
              :class="activeFilter === 'admin'
              ? 'bg-orange-500 text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'"
              class="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
          >
            Admins
          </button>
        </div>
        <div class="flex items-center gap-3">
          <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher (nom, email)..."
              class="border border-gray-200 rounded-lg px-4 py-1.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white w-56"
          />
          <button
              @click="toggleSort"
              class="border border-gray-200 bg-white rounded-lg px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1"
          >
            Nom
            <span class="text-gray-400">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
          </button>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="flex justify-center items-center py-24">
        <div class="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Employees table -->
      <div v-else-if="!errorMessage" class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table class="w-full text-sm">
          <thead>
          <tr class="border-b border-gray-100">
            <th class="text-left text-gray-500 font-medium px-6 py-3">Employé</th>
            <th class="text-left text-gray-500 font-medium px-6 py-3">Email</th>
            <th class="text-left text-gray-500 font-medium px-6 py-3">Rôle</th>
            <th class="text-left text-gray-500 font-medium px-6 py-3">Créé le</th>
            <th
                v-if="isAdmin"
                class="text-left text-gray-500 font-medium px-6 py-3"
            >
              Actions
            </th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="employee in filteredEmployees"
              :key="employee.id"
              class="border-b border-gray-50 hover:bg-gray-50 transition-colors"
          >
            <!-- Name + avatar -->
            <td class="px-6 py-3">
              <div class="flex items-center gap-3">
                <div
                    :class="getAvatarColor(employee.post)"
                    class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                >
                  {{ getInitials(employee.first_name, employee.last_name) }}
                </div>
                <span class="font-medium text-gray-800">
                    {{ employee.first_name }} {{ employee.last_name }}
                  </span>
              </div>
            </td>

            <!-- Email -->
            <td class="px-6 py-3 text-gray-500">{{ employee.email }}</td>

            <!-- Role -->
            <td class="px-6 py-3">
              <span :class="getRoleBadgeClass(employee.post)">{{ employee.post }}</span>
            </td>

            <!-- Date -->
            <td class="px-6 py-3 text-gray-500">{{ formatDate(employee.created_at) }}</td>

            <!-- Actions (only for admin) -->
            <td v-if="isAdmin" class="px-6 py-3">
              <div class="flex items-center gap-4">
                <button class="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-sm transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z"/>
                  </svg>
                  Éditer
                </button>
                <button class="text-red-400 hover:text-red-600 flex items-center gap-1 text-sm transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                  Suppr.
                </button>
              </div>
            </td>
          </tr>

          <!-- If there are no employees (empty) -->
          <tr v-if="filteredEmployees.length === 0">
            <td colspan="5" class="text-center text-gray-400 py-12 text-sm">
              Aucun employé trouvé.
            </td>
          </tr>
          </tbody>
        </table>
      </div>

    </main>
  </div>
</template>