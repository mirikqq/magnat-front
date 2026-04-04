<template>
  <div ref="rootRef" class="relative flex min-w-0 items-center gap-3 overflow-visible">
    <div ref="brandRef" class="shrink-0">
      <BrandLogo compact />
    </div>

    <div class="ml-auto flex min-w-0 flex-1 items-center justify-end gap-2">
      <div v-if="showInlineLinks" class="flex min-w-0 items-center justify-end gap-2 overflow-visible whitespace-nowrap">
        <RouterLink
          v-for="item in sideMenuRoutes"
          :key="item.path"
          :to="item.path"
          class="inline-flex h-9 shrink-0 items-center justify-center rounded-[var(--radius-base)] border border-[color:var(--button-border)] bg-white px-3 text-sm font-medium text-slate-700"
          active-class="!border-slate-900 !bg-slate-900 !text-white"
        >
          {{ item.label }}
        </RouterLink>
      </div>

      <div v-else class="relative flex items-center justify-end gap-2">
        <TransparentButton size="default" class="!h-9 !px-3" @click="menuOpen = !menuOpen">
          <Menu class="h-4 w-4" />
          <span>Меню</span>
        </TransparentButton>

        <div
          v-if="menuOpen"
          class="absolute right-0 top-[calc(100%+8px)] z-[180] min-w-[280px] rounded-[var(--radius-base)] border border-[color:var(--border)] bg-white p-2 shadow-[0_20px_48px_rgba(15,23,42,0.14)]"
        >
          <RouterLink
            v-for="item in sideMenuRoutes"
            :key="item.path"
            :to="item.path"
            class="flex h-9 w-full items-center rounded-[var(--radius-base)] px-3 text-sm font-medium text-slate-700"
            :class="isActive(item.path) ? 'bg-slate-900 text-white' : 'hover:bg-slate-100 hover:text-slate-950'"
            @click="menuOpen = false"
          >
            {{ item.label }}
          </RouterLink>
        </div>
      </div>

      <TransparentButton size="default" class="!h-9 !px-3" @click="logout">Выйти</TransparentButton>
    </div>

    <div class="pointer-events-none fixed left-[-9999px] top-[-9999px] opacity-0">
      <div ref="measureLinksRef" class="flex items-center gap-2 whitespace-nowrap">
        <div
          v-for="item in sideMenuRoutes"
          :key="`measure-${item.path}`"
          class="inline-flex h-9 shrink-0 items-center rounded-[var(--radius-base)] border border-[color:var(--button-border)] bg-white px-3 text-sm font-medium"
        >
          {{ item.label }}
        </div>
      </div>
      <div ref="measureMenuRef" class="mt-2 inline-flex h-9 items-center gap-2 rounded-[var(--radius-base)] border border-[color:var(--button-border)] bg-white px-3 text-sm font-medium">
        <span>Меню</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue'
import { Menu } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'
import { sideMenuRoutes } from '@/router/sidemenu'
import BrandLogo from '@/shared/ui/brand/BrandLogo.vue'
import TransparentButton from '@/shared/ui/button/TransparentButton.vue'
import { useAuthStore } from '@/modules/auth/model/use-auth-store'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const rootRef = useTemplateRef<HTMLDivElement>('rootRef')
const brandRef = useTemplateRef<HTMLDivElement>('brandRef')
const measureLinksRef = useTemplateRef<HTMLDivElement>('measureLinksRef')
const measureMenuRef = useTemplateRef<HTMLDivElement>('measureMenuRef')
const menuOpen = ref(false)
const showInlineLinks = ref(true)

let resizeObserver: ResizeObserver | null = null

function isActive(path: string) {
  return route.path === path || route.path.startsWith(`${path}/`)
}

async function logout() {
  authStore.logout()
  menuOpen.value = false
  await router.replace('/login')
}

function recomputeNavigationMode() {
  const rootWidth = rootRef.value?.clientWidth ?? 0
  const brandWidth = brandRef.value?.offsetWidth ?? 0
  const linksWidth = measureLinksRef.value?.offsetWidth ?? 0
  const menuWidth = measureMenuRef.value?.offsetWidth ?? 0

  if (!rootWidth || !brandWidth) {
    showInlineLinks.value = true
    return
  }

  const gap = 12
  const logoutWidth = 96
  const available = rootWidth - brandWidth - gap - logoutWidth
  showInlineLinks.value = linksWidth <= available || menuWidth > available

  if (showInlineLinks.value) {
    menuOpen.value = false
  }
}

function onPointerDown(event: PointerEvent) {
  const target = event.target as Node | null
  if (!menuOpen.value || !target) return

  const root = rootRef.value
  if (root && !root.contains(target)) {
    menuOpen.value = false
  }
}

watch(() => route.fullPath, () => {
  menuOpen.value = false
  void nextTick(recomputeNavigationMode)
})

onMounted(async () => {
  await nextTick()
  recomputeNavigationMode()

  resizeObserver = new ResizeObserver(() => {
    recomputeNavigationMode()
  })

  if (rootRef.value) {
    resizeObserver.observe(rootRef.value)
  }

  window.addEventListener('pointerdown', onPointerDown)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  window.removeEventListener('pointerdown', onPointerDown)
})
</script>