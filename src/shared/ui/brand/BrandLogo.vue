<template>
  <div :class="wrapperClass">
    <div class="flex h-10 w-10 items-center justify-center rounded-[calc(var(--radius-base)-2px)] bg-white/12 text-sm font-semibold text-white">
      IN
    </div>
    <div class="min-w-0">
      <div class="font-heading text-sm font-semibold tracking-[0.22em] text-white">INTEGRO</div>
      <div v-if="showCaption" class="font-caption text-[11px] uppercase tracking-[0.18em] text-slate-300">Supply Console</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    class?: string
    compact?: boolean
    showCaption?: boolean
  }>(),
  {
    class: '',
    compact: false,
    showCaption: false,
  },
)

const wrapperClass = computed(() =>
  cn(
    'inline-flex items-center gap-3 rounded-[var(--radius-base)] bg-[image:var(--button-gradient)] px-3 py-2 shadow-[0_14px_32px_rgba(15,23,42,0.18)]',
    props.compact ? 'px-2.5 py-2' : 'px-3 py-2.5',
    props.class,
  ),
)
</script>