import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { AuthLoginIn, AuthMeOut } from '@/openapi-gen/types.gen'
import { AUTH_STORAGE_KEY } from '@/shared/constants/auth'
import { mockAuthService } from '../api/mock-auth.service'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(AUTH_STORAGE_KEY))
  const user = ref<AuthMeOut | null>(null)
  const isAuthChecking = ref(false)
  const isInitialized = ref(false)
  let bootstrapPromise: Promise<void> | null = null

  const isAuthorized = computed(() => Boolean(token.value))

  async function bootstrap() {
    if (isInitialized.value) {
      return
    }

    if (bootstrapPromise) {
      return bootstrapPromise
    }

    bootstrapPromise = (async () => {
      isAuthChecking.value = true
      try {
        user.value = await mockAuthService.me(token.value)
        if (!user.value) {
          token.value = null
          localStorage.removeItem(AUTH_STORAGE_KEY)
        }
      } catch {
        token.value = null
        user.value = null
        localStorage.removeItem(AUTH_STORAGE_KEY)
      } finally {
        isInitialized.value = true
        isAuthChecking.value = false
        bootstrapPromise = null
      }
    })()

    return bootstrapPromise
  }

  async function login(payload: AuthLoginIn) {
    isAuthChecking.value = true
    try {
      const result = await mockAuthService.login(payload)
      token.value = result.access_token
      localStorage.setItem(AUTH_STORAGE_KEY, result.access_token)
      user.value = await mockAuthService.me(result.access_token)
      isInitialized.value = true
      return result
    } finally {
      isAuthChecking.value = false
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  return {
    token,
    user,
    isAuthorized,
    isAuthChecking,
    isInitialized,
    bootstrap,
    login,
    logout,
  }
})