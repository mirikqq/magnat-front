<script setup lang="ts">
import { AlertDialogDescription, type AlertDialogDescriptionProps, useForwardProps } from 'reka-ui'
import { cn } from '@/lib/utils'
const props = defineProps<AlertDialogDescriptionProps & { class?: string }>()
const forwarded = useForwardProps(props)
</script>

<template>
  <AlertDialogDescription v-bind="forwarded" :class="cn('text-sm leading-6 text-slate-500', props.class)">
    <slot />
  </AlertDialogDescription>
</template>