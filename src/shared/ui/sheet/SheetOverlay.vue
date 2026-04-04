<script setup lang="ts">
import { DialogOverlay, type DialogOverlayProps, useForwardProps } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<DialogOverlayProps & { class?: string }>()
const forwarded = useForwardProps(props)
</script>

<template>
  <DialogOverlay
    v-bind="forwarded"
    :class="cn('fixed inset-0 z-[210] bg-slate-950/32 backdrop-blur-[2px]', props.class)"
  >
    <slot />
  </DialogOverlay>
</template>