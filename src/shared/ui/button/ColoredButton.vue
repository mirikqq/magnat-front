<template>
  <ButtonPrimitive variant="colored" v-bind="$attrs">
    <slot />
  </ButtonPrimitive>
</template>

<script setup lang="ts">
import ButtonPrimitive from './ButtonPrimitive.vue'
</script>