<script setup lang="ts">
import { AlertDialogAction, type AlertDialogActionProps, useForwardProps } from 'reka-ui'
const props = defineProps<AlertDialogActionProps>()
const forwarded = useForwardProps(props)
</script>

<template>
  <AlertDialogAction v-bind="forwarded">
    <slot />
  </AlertDialogAction>
</template>