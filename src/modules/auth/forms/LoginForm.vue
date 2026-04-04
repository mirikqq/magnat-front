<template>
  <form class="flex flex-col gap-[var(--gap-default)]" @submit="onSubmit">
    <div class="space-y-1.5">
      <label class="font-caption text-[11px] uppercase tracking-[0.16em] text-slate-500" for="phone">Телефон</label>
      <input id="phone" v-model="phone" class="w-full px-3 py-2 text-sm" inputmode="tel" placeholder="+79990000000" />
      <p v-if="errors.phone" class="text-sm text-red-600">{{ errors.phone }}</p>
    </div>

    <div class="space-y-1.5">
      <label class="font-caption text-[11px] uppercase tracking-[0.16em] text-slate-500" for="password">Пароль</label>
      <input id="password" v-model="password" class="w-full px-3 py-2 text-sm" type="password" placeholder="secret" />
      <p v-if="errors.password" class="text-sm text-red-600">{{ errors.password }}</p>
    </div>

    <p v-if="submitError" class="rounded-[var(--radius-base)] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
      {{ submitError }}
    </p>

    <ColoredButton :loading="loading" full-width type="submit">Войти</ColoredButton>
  </form>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import ColoredButton from '@/shared/ui/button/ColoredButton.vue'

const schema = toTypedSchema(
  z.object({
    phone: z.string().min(1, 'Укажите телефон'),
    password: z.string().min(1, 'Укажите пароль'),
  }),
)

const props = withDefaults(
  defineProps<{
    loading?: boolean
    submitError?: string
    initialValues?: { phone?: string; password?: string }
  }>(),
  {
    loading: false,
    submitError: '',
    initialValues: () => ({ phone: '', password: '' }),
  },
)

const emit = defineEmits<{
  (e: 'submit', values: { phone: string; password: string }): void
}>()

const { errors, handleSubmit, defineField } = useForm({
  validationSchema: schema,
  initialValues: props.initialValues,
})

const [phone] = defineField('phone')
const [password] = defineField('password')

const submitError = computed(() => props.submitError)

const onSubmit = handleSubmit((values) => {
  emit('submit', values)
})
</script>