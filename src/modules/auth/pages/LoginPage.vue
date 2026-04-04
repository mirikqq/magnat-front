<template>
  <div class="flex min-h-screen items-center justify-center p-[var(--space-1)]">
    <div class="grid w-full max-w-[1080px] gap-[var(--space-1)] lg:grid-cols-[1.15fr_0.85fr]">
      <Tile class="hidden min-h-[520px] bg-[image:radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),transparent_40%),var(--button-gradient)] text-white lg:flex lg:flex-col lg:justify-between">
        <BrandLogo :show-caption="true" class="w-fit !shadow-none" />
        <div class="space-y-3">
          <div class="font-heading text-4xl font-semibold leading-tight">Операционный интерфейс поставок без лишнего шума.</div>
          <p class="max-w-[420px] text-sm leading-6 text-slate-200">
            Integro собирает потребность, поставки, остатки и задачи фулфилмента в одном плотном рабочем пространстве.
          </p>
        </div>
      </Tile>

      <Tile class="min-h-[520px] justify-center">
        <div class="mx-auto flex w-full max-w-[360px] flex-col gap-6">
          <div class="space-y-3">
            <BrandLogo :show-caption="true" class="w-fit !shadow-none" />
            <div>
              <h1 class="font-heading text-3xl font-semibold text-slate-950">Вход в Integro</h1>
              <p class="mt-2 text-sm leading-6 text-slate-500">Используй тестовые данные, чтобы открыть интерфейс и продолжить работу.</p>
            </div>
          </div>

          <LoginForm :loading="store.isAuthChecking" :submit-error="submitError" :initial-values="initialValues" @submit="submit" />

          <div class="rounded-[var(--radius-base)] border border-[color:var(--border)] bg-slate-50 px-3 py-3 text-sm text-slate-500">
            <div><span class="font-medium text-slate-700">Телефон:</span> +79990000000</div>
            <div><span class="font-medium text-slate-700">Пароль:</span> secret</div>
          </div>
        </div>
      </Tile>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { toast } from 'vue-sonner'
import { useAuthStore } from '../model/use-auth-store'
import LoginForm from '../forms/LoginForm.vue'
import Tile from '@/shared/ui/tile/Tile.vue'
import BrandLogo from '@/shared/ui/brand/BrandLogo.vue'

const store = useAuthStore()
const router = useRouter()
const route = useRoute()
const submitError = ref('')
const initialValues = {
  phone: '+79990000000',
  password: 'secret',
}

async function submit(values: { phone: string; password: string }) {
  submitError.value = ''
  try {
    await store.login(values)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/needed'
    await router.replace(redirect)
    toast.success('Вы вошли в Integro')
  } catch (error) {
    submitError.value = (error as Error).message || 'Не удалось выполнить вход'
  }
}
</script>