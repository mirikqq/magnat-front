<script setup lang="ts">
import { AlertDialogCancel, type AlertDialogCancelProps, useForwardProps } from 'reka-ui'
const props = defineProps<AlertDialogCancelProps>()
const forwarded = useForwardProps(props)
</script>

<template>
  <AlertDialogCancel v-bind="forwarded">
    <slot />
  </AlertDialogCancel>
</template>