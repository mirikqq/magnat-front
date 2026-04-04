<template>
  <section class="page">
    <div class="tile-surface space-y-4">
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-slate-950">Поставщики</h1>
          <p class="mt-1 text-sm text-slate-500">Управление справочником поставщиков через боковые формы.</p>
        </div>
        <ColoredButton @click="openCreate">Создать поставщика</ColoredButton>
      </div>

      <input v-model="search" placeholder="Поиск по названию" class="w-full px-3 py-2 text-sm" />

      <DataTable
        :columns="columns"
        :rows="rows"
        :loading="query.isLoading.value"
      />
    </div>

    <BaseSheet :open="sheetOpen" :title="sheetTitle" :description="sheetDescription" @update:open="handleSheetOpenChange">
      <SupplierForm
        :mode="sheetMode"
        :initial-values="formInitialValues"
        :loading="saving"
        :submit-error="submitError"
        @submit="submitForm"
        @cancel="closeSheet"
      />
    </BaseSheet>

    <ConfirmDeleteDialog
      :open="confirmDialog.open.value"
      :title="confirmDialog.title.value"
      :description="confirmDialog.description.value"
      @update:open="onConfirmDialogOpenChange"
      @confirm="confirmDialog.confirm"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, h, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import { useRoute, useRouter } from 'vue-router'
import { createColumnHelper } from '@tanstack/vue-table'
import DataTable from '@/components/shared/Table/DataTable.vue'
import { queryKeys } from '@/shared/composables/queryKeys'
import { useAppQuery } from '@/shared/composables/useAppQuery'
import ColoredButton from '@/shared/ui/button/ColoredButton.vue'
import TransparentButton from '@/shared/ui/button/TransparentButton.vue'
import BaseSheet from '@/shared/ui/sheet/BaseSheet.vue'
import ConfirmDeleteDialog from '@/shared/ui/dialog/ConfirmDeleteDialog.vue'
import { useAwaitConfirmDialog } from '@/shared/ui/dialog/useAwaitConfirmDialog'
import SupplierForm from '@/modules/suppliers/forms/SupplierForm.vue'
import { suppliersService } from '@/modules/suppliers/api/suppliers.service'

interface SupplierRow {
  id: number
  name: string
}

const route = useRoute()
const router = useRouter()
const search = ref('')
const saving = ref(false)
const submitError = ref('')
const sheetOpen = ref(false)
const sheetMode = ref<'create' | 'edit'>('create')
const currentSupplier = ref<SupplierRow | null>(null)
const confirmDialog = useAwaitConfirmDialog()

const query = useAppQuery({
  key: computed(() => queryKeys.suppliers(search.value)),
  query: () => suppliersService.list(search.value),
})

watch(() => query.error.value, (error) => {
  if (error) toast.error('Ошибка загрузки поставщиков')
})

const rows = computed(() => query.data.value ?? [])
const formInitialValues = computed(() => ({ name: currentSupplier.value?.name ?? '' }))
const sheetTitle = computed(() => (sheetMode.value === 'edit' ? 'Редактировать поставщика' : 'Создать поставщика'))
const sheetDescription = computed(() => (sheetMode.value === 'edit' ? 'Обнови данные и сохрани изменения.' : 'Новый поставщик появится в общем справочнике сразу после сохранения.'))

const columnHelper = createColumnHelper<SupplierRow>()
const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
    size: 100,
    cell: (info) => h('span', { class: 'font-data text-slate-700' }, String(info.getValue())),
  }),
  columnHelper.accessor('name', {
    header: 'Наименование',
    size: 520,
    cell: (info) => h('button', {
      class: 'text-left text-slate-900 hover:text-slate-700',
      onClick: () => openEdit(info.row.original),
    }, info.getValue()),
  }),
  columnHelper.display({
    id: 'edit',
    header: 'Изменить',
    size: 140,
    cell: (info) => h(TransparentButton, { size: 'sm', onClick: () => openEdit(info.row.original) }, () => 'Редактировать'),
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Удалить',
    size: 120,
    cell: (info) => h(TransparentButton, {
      size: 'sm',
      class: '!text-red-600',
      onClick: async (event: Event) => {
        event.stopPropagation()
        await remove(info.row.original.id)
      },
    }, () => 'Удалить'),
  }),
]

watch(search, () => void query.refetch())
watch(
  () => route.query,
  async (queryParams) => {
    const mode = typeof queryParams.mode === 'string' ? queryParams.mode : ''
    const edit = typeof queryParams.edit === 'string' ? queryParams.edit : ''

    if (mode === 'create') {
      sheetMode.value = 'create'
      currentSupplier.value = null
      submitError.value = ''
      sheetOpen.value = true
      return
    }

    if (edit) {
      sheetMode.value = 'edit'
      submitError.value = ''
      try {
        currentSupplier.value = await suppliersService.get(edit)
        sheetOpen.value = true
      } catch (error) {
        toast.error((error as Error).message || 'Не удалось открыть форму поставщика')
        await clearSheetQuery()
      }
      return
    }

    sheetOpen.value = false
    currentSupplier.value = null
    submitError.value = ''
  },
  { immediate: true },
)

function openCreate() {
  void router.replace({ path: '/suppliers', query: { mode: 'create' } })
}

function openEdit(supplier: SupplierRow) {
  void router.replace({ path: '/suppliers', query: { edit: String(supplier.id) } })
}

function closeSheet() {
  void clearSheetQuery()
}

function handleSheetOpenChange(value: boolean) {
  sheetOpen.value = value
  if (!value) {
    void clearSheetQuery()
  }
}

async function clearSheetQuery() {
  if (route.path !== '/suppliers') return
  if (!route.query.mode && !route.query.edit) return
  await router.replace({ path: '/suppliers', query: {} })
}

async function submitForm(values: { name: string }) {
  saving.value = true
  submitError.value = ''

  try {
    if (sheetMode.value === 'edit' && currentSupplier.value) {
      await suppliersService.update(currentSupplier.value.id, values)
      toast.success('Поставщик обновлен')
    } else {
      await suppliersService.create(values)
      toast.success('Поставщик создан')
    }

    await query.refetch()
    closeSheet()
  } catch (error) {
    submitError.value = (error as Error).message || 'Не удалось сохранить поставщика'
  } finally {
    saving.value = false
  }
}

async function remove(id: number) {
  const confirmed = await confirmDialog.ask({
    title: 'Удалить поставщика?',
    description: 'Поставщик будет удален из справочника. Это действие нельзя отменить.',
  })

  if (!confirmed) return

  await suppliersService.remove(id)
  await query.refetch()
  toast.success('Поставщик удален')
}

function onConfirmDialogOpenChange(value: boolean) {
  if (!value) {
    confirmDialog.cancel()
  }
}
</script>