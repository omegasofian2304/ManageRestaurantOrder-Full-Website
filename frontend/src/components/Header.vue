<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()
const router = useRouter()

const userName = ref('...')
const mobileOpen = ref(false)

const userPost = computed(() => authStore.post ?? '')

// Compute initials from full name (e.g. "Milo Soleil" → "MS")
const initials = computed(() => {
  const parts = userName.value.trim().split(' ')
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return parts[0]?.[0]?.toUpperCase() ?? '?'
})

// Show Menu/Équipe only for managers and admins
const isManager = computed(() => userPost.value === 'admin' || userPost.value === 'manager')

onMounted(async () => {
  if (!authStore.id || !authStore.accessToken) return

  const res = await fetch(`http://localhost:3000/employees/${authStore.id}`, {
    headers: { Authorization: `Bearer ${authStore.accessToken}` }
  })

  if (res.ok) {
    const data = await res.json()
    userName.value = `${data.first_name} ${data.last_name}`
  }
})

function logout() {
  authStore.$reset()
  router.push('/login')
}
</script>
<template>
  <!-- Prompt to Claude : Generate the CSS tailwind for the following header -->
  <!-- Sticky top header -->
  <header class="sticky top-0 z-50 flex h-14 items-center gap-8 border-b border-gray-200 bg-white px-6">

    <!-- Brand -->
    <div class="flex flex-shrink-0 items-center gap-2">
      <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-lg" aria-hidden="true">🍽</span>
      <span class="text-[15px] font-semibold text-gray-900 whitespace-nowrap">Manage Restaurant Order</span>
    </div>

    <!-- Desktop navigation -->
    <nav class="hidden lg:flex flex-1 items-center gap-1" aria-label="Main navigation">
      <router-link to="/orders/new" class="nav-link">Nouvelle commande</router-link>
      <router-link to="/orders" class="nav-link">Commandes</router-link>
      <router-link v-if="isManager" to="/meals" class="nav-link">Menu</router-link>
      <router-link v-if="isManager" to="/employees" class="nav-link">Équipe</router-link>
    </nav>

    <!-- User info (desktop) -->
    <div class="hidden lg:flex items-center gap-2 ml-auto flex-shrink-0">
      <!-- Avatar circle with initials -->
      <div
          class="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-full bg-orange-500 text-[11px] font-bold text-white"
          :title="userName"
          aria-hidden="true"
      >
        {{ initials }}
      </div>

      <!-- Name and role -->
      <div class="flex items-center gap-1 text-[13px]">
        <span class="font-medium text-gray-900">{{ userName }}</span>
        <span class="text-gray-400" aria-hidden="true">·</span>
        <span class="text-gray-500">{{ userPost }}</span>
      </div>

      <!-- Logout button -->
      <button
          class="ml-1 flex items-center rounded p-1 text-gray-400 transition-colors hover:text-red-500"
          @click="logout"
          title="Log out"
          aria-label="Log out"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </button>
    </div>

    <!-- Hamburger button (mobile only) -->
    <button
        class="ml-auto flex items-center rounded p-1 text-gray-600 lg:hidden"
        @click="mobileOpen = !mobileOpen"
        aria-label="Toggle menu"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>
  </header>

  <!-- Mobile dropdown menu -->
  <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
  >
    <div v-if="mobileOpen" class="flex flex-col border-b border-gray-200 bg-white px-4 pb-4 pt-2 lg:hidden">
      <router-link to="/orders/new" class="mobile-link" @click="mobileOpen = false">Nouvelle commande</router-link>
      <router-link to="/orders" class="mobile-link" @click="mobileOpen = false">Commandes</router-link>
      <router-link v-if="isManager" to="/meals" class="mobile-link" @click="mobileOpen = false">Menu</router-link>
      <router-link v-if="isManager" to="/employees" class="mobile-link" @click="mobileOpen = false">Équipe</router-link>

      <!-- Divider -->
      <div class="my-2 border-t border-gray-100" />

      <!-- Mobile user info -->
      <div class="flex items-center gap-2 px-2 py-1">
        <div class="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-[11px] font-bold text-white">
          {{ initials }}
        </div>
        <span class="text-[13px] font-medium text-gray-800">{{ userName }}</span>
        <span class="text-[12px] text-gray-400">{{ userPost }}</span>
      </div>

      <!-- Mobile logout -->
      <button
          class="mt-1 rounded-md px-2 py-2.5 text-left text-[15px] text-red-500 transition-colors hover:bg-red-50"
          @click="logout"
      >
        Log out
      </button>
    </div>
  </Transition>
</template>

<style scoped>
/* Active nav link — orange + underline, matching the mockup */
.nav-link {
  @apply rounded-md px-3 py-1.5 text-sm text-gray-500 no-underline transition-colors hover:bg-gray-100 hover:text-gray-900;
}

.nav-link.router-link-active,
.nav-link.router-link-exact-active {
  @apply bg-transparent text-orange-500 underline underline-offset-4;
}

/* Mobile nav links */
.mobile-link {
  @apply rounded-md px-2 py-2.5 text-[15px] text-gray-700 no-underline transition-colors hover:bg-orange-50 hover:text-orange-500;
}

.mobile-link.router-link-active {
  @apply bg-orange-50 text-orange-500;
}
</style>