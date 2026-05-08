import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        accessToken: null,
        id: null,
        post: null
    }),
    getters: {
        isTokenExpired: (state) => {
            if (!state.accessToken) return true

            try {
                const payload = jwtDecode(state.accessToken)
                const now = Date.now() / 1000
                return payload.exp < now
            } catch {
                return true
            }
        }
    },
    actions: {
        setAccessToken(token) {
            this.accessToken = token
            const payload = jwtDecode(token)
            this.id = payload.id
            this.post = payload.post
        },
        clearAuth() {
            this.accessToken = null
            this.id = null
            this.post = null
        }
    }
})