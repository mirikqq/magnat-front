import { ref, unref, watch, type MaybeRefOrGetter } from 'vue'

function resolveValue(value: MaybeRefOrGetter<boolean>) {
  if (typeof value === 'function') {
    return (value as () => boolean)()
  }
  return unref(value)
}

export function useDelayedSkeleton(loading: MaybeRefOrGetter<boolean>, delay = 180) {
  const showSkeleton = ref(false)
  let timer: ReturnType<typeof setTimeout> | null = null

  function clearTimer() {
    if (!timer) return
    clearTimeout(timer)
    timer = null
  }

  watch(
    () => resolveValue(loading),
    (isLoading) => {
      clearTimer()

      if (isLoading) {
        showSkeleton.value = false
        timer = setTimeout(() => {
          showSkeleton.value = true
        }, delay)
        return
      }

      showSkeleton.value = false
    },
    { immediate: true },
  )

  return showSkeleton
}