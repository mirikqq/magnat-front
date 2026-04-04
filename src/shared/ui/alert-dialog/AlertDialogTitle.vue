<script setup lang="ts">
import { AlertDialogTitle, type AlertDialogTitleProps, useForwardProps } from 'reka-ui'
import { cn } from '@/lib/utils'
const props = defineProps<AlertDialogTitleProps & { class?: string }>()
const forwarded = useForwardProps(props)
</script>

<template>
  <AlertDialogTitle v-bind="forwarded" :class="cn('font-heading text-lg font-semibold text-slate-950', props.class)">
    <slot />
  </AlertDialogTitle>
</template>