<template>
  <div class="flex h-screen">
    <!-- Conteneur gauche (vide pour l'instant) -->
    <div class="w-1/2 bg-orange-500 flex flex-col justify-between p-12 text-white">
      <div>
        <h2 class="text-lg font-medium">Manage Restaurant Order</h2>
      </div>

      <div>
        <h1 class="text-6xl font-bold leading-tight mb-6">
          La caisse rapide<br>
          de votre fast<br>
          food.
        </h1>
        <p class="text-base opacity-90">
          Prise de commandes, service, gestion du menu et<br>
          des équipes en un seul outil.
        </p>
      </div>

      <div></div>
    </div>

    <!-- Conteneur droit avec le login -->
    <div class="w-1/2 flex items-center justify-center bg-gray-100">
      <div class="bg-white w-96 shadow-lg rounded-xl flex flex-col gap-4 p-8">
        <h1 class="font-bold text-2xl text-gray-800">Connexion</h1>
        <p class="text-gray-500">Identifiez-vous pour accéder à votre espace.</p>

        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-700">Email</label>
          <input
              v-model="email"
              type="email"
              placeholder="exemple@email.com"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <label class="text-sm font-medium text-gray-700">Mot de passe</label>
          <input
              v-model="password"
              type="password"
              placeholder="PASSWORD"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button @click.prevent="handleLogin" class="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 rounded-lg transition-colors">
          Se connecter
        </button>

        <p class="text-gray-400">Besoin d'un compte ? Contactez votre admin.</p>
        <p v-if="error" class="text-red-600">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const email = ref('')
const password = ref('')
let error = ref('')

async function handleLogin() {
  error.value = ''
  if (!email.value || !password.value) {
    error.value = 'Email et mot de passe requis'
    return
  }
  if (!emailRegex.test(email.value)) {
    error.value = 'Email invalide !'
    return
  }

  const res = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  })

  const data = await res.json()

  if (!res.ok) {
    error.value = data.error
    return
  }

  authStore.setAccessToken(data.data.token)

  email.value = ''
  password.value = ''
  await router.push('/employees/create')
}
</script>