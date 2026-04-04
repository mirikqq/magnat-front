<template>
  <section :class="tileClass">
    <slot />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    class?: string
    compact?: boolean
  }>(),
  {
    class: '',
    compact: false,
  },
)

const tileClass = computed(() =>
  cn(
    'rounded-[var(--radius-base)] border border-[color:var(--border)] bg-[color:var(--background-elevated)] shadow-[var(--shadow-card)]',
    props.compact ? 'p-[var(--padding-default)]' : 'p-[var(--tile-padding)]',
    props.class,
  ),
)
</script>