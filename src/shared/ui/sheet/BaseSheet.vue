<template>
  <Sheet :open="open" @update:open="emit('update:open', $event)">
    <SheetContent class="flex flex-col">
      <SheetHeader>
        <SheetTitle>{{ title }}</SheetTitle>
        <SheetDescription v-if="description">{{ description }}</SheetDescription>
      </SheetHeader>
      <div class="flex-1 overflow-y-auto px-[var(--tile-padding)] py-[var(--tile-padding)]">
        <slot />
      </div>
      <SheetFooter v-if="$slots.footer">
        <slot name="footer" />
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import Sheet from './Sheet.vue'
import SheetContent from './SheetContent.vue'
import SheetDescription from './SheetDescription.vue'
import SheetFooter from './SheetFooter.vue'
import SheetHeader from './SheetHeader.vue'
import SheetTitle from './SheetTitle.vue'

defineProps<{
  open: boolean
  title: string
  description?: string
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()
</script>