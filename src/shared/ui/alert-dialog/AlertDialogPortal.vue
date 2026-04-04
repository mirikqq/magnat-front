<script setup lang="ts">
import { AlertDialogPortal, type AlertDialogPortalProps, useForwardProps } from 'reka-ui'
const props = defineProps<AlertDialogPortalProps>()
const forwarded = useForwardProps(props)
</script>

<template>
  <AlertDialogPortal v-bind="forwarded">
    <slot />
  </AlertDialogPortal>
</template>