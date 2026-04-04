import { ref } from 'vue'

export function useAwaitConfirmDialog() {
  const open = ref(false)
  const title = ref('Удалить запись?')
  const description = ref('Это действие нельзя отменить.')
  let resolver: ((value: boolean) => void) | null = null

  function ask(options?: { title?: string; description?: string }) {
    title.value = options?.title ?? 'Удалить запись?'
    description.value = options?.description ?? 'Это действие нельзя отменить.'
    open.value = true
    return new Promise<boolean>((resolve) => {
      resolver = resolve
    })
  }

  function confirm() {
    open.value = false
    resolver?.(true)
    resolver = null
  }

  function cancel() {
    open.value = false
    resolver?.(false)
    resolver = null
  }

  return {
    open,
    title,
    description,
    ask,
    confirm,
    cancel,
  }
}