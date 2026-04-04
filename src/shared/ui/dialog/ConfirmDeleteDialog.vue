<template>
  <AlertDialog :open="open" @update:open="emit('update:open', $event)">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ title }}</AlertDialogTitle>
        <AlertDialogDescription>{{ description }}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel as-child>
          <TransparentButton>Отмена</TransparentButton>
        </AlertDialogCancel>
        <AlertDialogAction as-child>
          <ColoredButton @click="emit('confirm')">Подтвердить</ColoredButton>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script setup lang="ts">
import ColoredButton from '@/shared/ui/button/ColoredButton.vue'
import TransparentButton from '@/shared/ui/button/TransparentButton.vue'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog'

withDefaults(
  defineProps<{
    open: boolean
    title?: string
    description?: string
  }>(),
  {
    title: 'Удалить запись?',
    description: 'Это действие нельзя отменить.',
  },
)

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'confirm'): void
}>()
</script>