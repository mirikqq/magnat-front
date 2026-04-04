<script setup lang="ts">
import { AlertDialogContent, type AlertDialogContentEmits, type AlertDialogContentProps, useForwardPropsEmits } from 'reka-ui'
import { cn } from '@/lib/utils'
import AlertDialogPortal from './AlertDialogPortal.vue'
import AlertDialogOverlay from './AlertDialogOverlay.vue'

const props = defineProps<AlertDialogContentProps & { class?: string }>()
const emits = defineEmits<AlertDialogContentEmits>()
const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogContent v-bind="forwarded" :class="cn('fixed left-1/2 top-1/2 z-[220] w-[min(420px,calc(100vw-16px))] -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-base)] border border-[color:var(--border)] bg-[color:var(--background-elevated)] p-[var(--tile-padding)] shadow-[0_24px_60px_rgba(15,23,42,0.18)] outline-none', props.class)">
      <slot />
    </AlertDialogContent>
  </AlertDialogPortal>
</template>