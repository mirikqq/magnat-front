<script setup lang="ts">
import { DialogTitle, type DialogTitleProps, useForwardProps } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<DialogTitleProps & { class?: string }>()
const forwarded = useForwardProps(props)
</script>

<template>
  <DialogTitle v-bind="forwarded" :class="cn('font-heading text-lg font-semibold text-slate-950', props.class)">
    <slot />
  </DialogTitle>
</template>