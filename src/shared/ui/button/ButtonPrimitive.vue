<template>
  <component :is="as" :class="classes" :disabled="disabled || loading" :type="resolvedType" v-bind="$attrs">
    <svg v-if="loading" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-opacity="0.25" stroke-width="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
    </svg>
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { buttonVariants, type ButtonVariants } from './buttonVariants'

const props = withDefaults(
  defineProps<{
    as?: string | object
    disabled?: boolean
    loading?: boolean
    class?: string
    variant?: ButtonVariants['variant']
    size?: ButtonVariants['size']
    fullWidth?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    as: 'button',
    disabled: false,
    loading: false,
    class: '',
    variant: 'transparent',
    size: 'default',
    fullWidth: false,
    type: 'button',
  },
)

const classes = computed(() => cn(buttonVariants({ variant: props.variant, size: props.size, fullWidth: props.fullWidth }), props.class))
const resolvedType = computed(() => (props.as === 'button' ? props.type : undefined))
</script>