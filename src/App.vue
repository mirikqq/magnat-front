<template>
  <RouterView />
  <AppSplash :visible="showSplash" />
  <AppToaster rich-colors position="bottom-right" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterView } from 'vue-router'
import AppSplash from '@/shared/ui/splash/AppSplash.vue'
import { useAuthStore } from '@/modules/auth/model/use-auth-store'

const authStore = useAuthStore()
const splashDelayElapsed = ref(false)
let splashTimer: ReturnType<typeof setTimeout> | null = null

function clearSplashTimer() {
  if (splashTimer) {
    clearTimeout(splashTimer)
    splashTimer = null
  }
}

watch(
  () => authStore.isAuthChecking,
  (checking) => {
    clearSplashTimer()
    splashDelayElapsed.value = false

    if (checking) {
      splashTimer = setTimeout(() => {
        splashDelayElapsed.value = true
      }, 200)
    }
  },
  { immediate: true },
)

onMounted(() => {
  void authStore.bootstrap()
})

const showSplash = computed(() => authStore.isAuthChecking && splashDelayElapsed.value)
</script>