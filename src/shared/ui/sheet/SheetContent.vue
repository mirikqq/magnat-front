<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { DialogClose, DialogContent, type DialogContentEmits, type DialogContentProps, useForwardPropsEmits } from 'reka-ui'
import { cn } from '@/lib/utils'
import SheetPortal from './SheetPortal.vue'
import SheetOverlay from './SheetOverlay.vue'

const props = withDefaults(
  defineProps<DialogContentProps & { class?: string; side?: 'left' | 'right' }>(),
  { side: 'right', class: '' },
)
const emits = defineEmits<DialogContentEmits>()
const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <SheetPortal>
    <SheetOverlay />
    <DialogContent
      v-bind="forwarded"
      :class="cn(
        'fixed top-0 z-[220] h-screen w-[min(560px,calc(100vw-16px))] border-[color:var(--border)] bg-[color:var(--background-elevated)] p-0 shadow-[0_24px_60px_rgba(15,23,42,0.18)] outline-none',
        side === 'right' ? 'right-0 border-l' : 'left-0 border-r',
        props.class,
      )"
    >
      <slot />
      <DialogClose class="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius-base)] border border-[color:var(--button-border)] bg-white text-slate-500">
        <X class="h-4 w-4" />
        <span class="sr-only">Закрыть</span>
      </DialogClose>
    </DialogContent>
  </SheetPortal>
</template>