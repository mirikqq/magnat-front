<template>
  <Transition name="fade">
    <div v-if="visible" class="fixed inset-0 z-[300] flex items-center justify-center bg-[color:var(--page-bg)]/98 backdrop-blur-sm">
      <div class="flex flex-col items-center gap-4">
        <BrandLogo :show-caption="true" class="!rounded-[14px] !px-4 !py-3" />
        <div class="font-caption text-[11px] uppercase tracking-[0.22em] text-slate-500">Preparing workspace</div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import BrandLogo from '@/shared/ui/brand/BrandLogo.vue'

defineProps<{
  visible: boolean
}>()
</script>