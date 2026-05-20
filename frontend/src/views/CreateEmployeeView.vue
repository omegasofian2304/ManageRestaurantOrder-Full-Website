<template>
  <div class="flex h-screen">
    <!-- Panneau gauche -->
    <div class="w-1/2 bg-orange-500 flex flex-col justify-between p-12 text-white">
      <div>
        <h2 class="text-lg font-medium">Manage Restaurant Order</h2>
      </div>
      <div>
        <h1 class="text-6xl font-bold leading-tight mb-6">
          Gérez votre<br>
          équipe en<br>
          un clic.
        </h1>
        <p class="text-base opacity-90">
          Ajoutez de nouveaux membres, définissez<br>
          leurs rôles et gérez les accès facilement.
        </p>
      </div>
      <div></div>
    </div>

    <!-- Panneau droit avec le formulaire -->
    <div class="w-1/2 flex items-center justify-center bg-gray-100">
      <div class="bg-white w-96 shadow-lg rounded-xl flex flex-col gap-4 p-8">
        <h1 class="font-bold text-2xl text-gray-800">Nouvel employé</h1>
        <p class="text-gray-500">Remplissez les informations du nouveau membre.</p>

        <div class="flex flex-col gap-3">
          <div class="flex gap-3">
            <div class="flex flex-col gap-1 w-1/2">
              <label class="text-sm font-medium text-gray-700">Prénom</label>
              <input
                  v-model="firstname"
                  type="text"
                  placeholder="Jean"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
            </div>
            <div class="flex flex-col gap-1 w-1/2">
              <label class="text-sm font-medium text-gray-700">Nom</label>
              <input
                  v-model="lastname"
                  type="text"
                  placeholder="Dupont"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-700">Email</label>
            <input
                v-model="email"
                type="email"
                placeholder="exemple@email.com"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-700">Mot de passe</label>
            <input
                v-model="password"
                type="password"
                placeholder="Password"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-700">Rôle</label>
            <select
                v-model="post"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            >
              <option value="" disabled>Sélectionner un rôle</option>
              <option value="employee">Employé</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <button
            @click="handleCreate"
            :disabled="loading"
            class="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition-colors"
        >
          {{ loading ? 'Création...' : 'Créer l\'employé' }}
        </button>

        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
        <p v-if="success" class="text-green-600 text-sm">Employé créé avec succès.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { createEmployeeService } from '../services/employeeService'

const authStore = useAuthStore()

const firstname = ref('')
const lastname = ref('')
const email = ref('')
const password = ref('')
const post = ref('')
const error = ref('')
const success = ref(false)
const loading = ref(false)

async function handleCreate() {
  error.value = ''
  success.value = false

  if (!firstname.value || !lastname.value || !email.value || !password.value || !post.value) {
    error.value = 'Tous les champs sont requis.'
    return
  }

  loading.value = true
  try {
    await createEmployeeService(authStore.accessToken, {
      firstname: firstname.value,
      lastname: lastname.value,
      email: email.value,
      password: password.value,
      post: post.value
    })

    success.value = true
    firstname.value = ''
    lastname.value = ''
    email.value = ''
    password.value = ''
    post.value = ''
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>