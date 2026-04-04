<template>
  <form class="flex flex-col gap-[var(--gap-default)]" @submit="onSubmit">
    <div class="space-y-1.5">
      <label class="text-sm font-medium text-slate-700" for="supplier-name">Наименование</label>
      <input id="supplier-name" v-model="name" class="w-full px-3 py-2 text-sm" placeholder="Введите наименование" />
      <p v-if="errors.name" class="text-sm text-red-600">{{ errors.name }}</p>
    </div>

    <p v-if="submitError" class="rounded-[var(--radius-base)] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
      {{ submitError }}
    </p>

    <div class="flex items-center justify-end gap-[var(--gap-default)] pt-2">
      <TransparentButton type="button" @click="emit('cancel')">Отмена</TransparentButton>
      <ColoredButton :loading="loading" type="submit">{{ submitLabel }}</ColoredButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import ColoredButton from '@/shared/ui/button/ColoredButton.vue'
import TransparentButton from '@/shared/ui/button/TransparentButton.vue'

const schema = toTypedSchema(
  z.object({
    name: z.string().trim().min(1, 'Укажите наименование'),
  }),
)

const props = withDefaults(
  defineProps<{
    mode?: 'create' | 'edit'
    initialValues?: { name?: string }
    loading?: boolean
    submitError?: string
    submitLabel?: string
  }>(),
  {
    mode: 'create',
    initialValues: () => ({ name: '' }),
    loading: false,
    submitError: '',
    submitLabel: '',
  },
)

const emit = defineEmits<{
  (e: 'submit', values: { name: string }): void
  (e: 'cancel'): void
}>()

const { defineField, errors, handleSubmit, resetForm } = useForm({
  validationSchema: schema,
  initialValues: props.initialValues,
})

const [name] = defineField('name')

watch(
  () => props.initialValues,
  (values: { name?: string } | undefined) => {
    resetForm({ values: { name: values?.name ?? '' } })
  },
  { deep: true },
)

const submitLabel = computed(() => props.submitLabel || (props.mode === 'edit' ? 'Сохранить' : 'Создать'))
const onSubmit = handleSubmit((values) => emit('submit', values))
</script>