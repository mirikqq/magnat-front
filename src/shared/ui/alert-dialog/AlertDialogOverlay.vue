<script setup lang="ts">
import { AlertDialogOverlay, type AlertDialogOverlayProps, useForwardProps } from 'reka-ui'
import { cn } from '@/lib/utils'
const props = defineProps<AlertDialogOverlayProps & { class?: string }>()
const forwarded = useForwardProps(props)
</script>

<template>
  <AlertDialogOverlay v-bind="forwarded" :class="cn('fixed inset-0 z-[210] bg-slate-950/32 backdrop-blur-[2px]', props.class)">
    <slot />
  </AlertDialogOverlay>
</template>