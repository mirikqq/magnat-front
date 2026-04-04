<template>
  <div class="w-full flex-1 min-h-0">
    <div class="w-full flex-1 min-h-0">
      <table class="min-w-full border-collapse text-sm">
        <thead class="bg-slate-50/80">
          <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <th
              v-for="header in headerGroup.headers"
              :key="header.id"
              class="border-b px-3 py-3 text-left"
              :style="columnStyle(header.column)"
            >
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </th>
          </tr>
        </thead>
        <Transition name="table-fade" mode="out-in">
          <tbody v-if="showSkeleton" key="loading">
            <tr v-for="index in skeletonRows" :key="`skeleton-${index}`" class="pointer-events-none">
              <td
                v-for="column in table.getVisibleLeafColumns()"
                :key="`${index}-${column.id}`"
                class="border-b px-3 py-3 align-top"
                :style="columnStyle(column)"
              >
                <div class="h-6 w-full animate-pulse rounded-md bg-slate-200/80" />
              </td>
            </tr>
          </tbody>
          <tbody v-else-if="table.getRowModel().rows.length" key="rows">
            <tr
              v-for="row in table.getRowModel().rows"
              :key="row.id"
              class="hover:bg-slate-50/70"
              :class="rowClass"
              @click="emit('rowClick', row)"
            >
              <td
                v-for="cell in row.getVisibleCells()"
                :key="cell.id"
                class="border-b px-3 py-3 align-top"
                :style="columnStyle(cell.column)"
              >
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </td>
            </tr>
          </tbody>
          <tbody v-else-if="loading" key="pending" />
          <TableNotFoundRow v-else key="empty" :colspan="table.getVisibleLeafColumns().length || 1" />
        </Transition>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts" generic="TData">
import type { ColumnDef, Row } from '@tanstack/vue-table'
import { FlexRender, getCoreRowModel, useVueTable } from '@tanstack/vue-table'
import TableNotFoundRow from './TableNotFoundRow.vue'
import { useDelayedSkeleton } from '@/shared/composables/useDelayedSkeleton'

const props = withDefaults(
  defineProps<{
    columns: ColumnDef<TData, any>[]
    rows: TData[]
    loading?: boolean
    rowClass?: string
    skeletonRows?: number
    skeletonDelay?: number
  }>(),
  {
    loading: false,
    rowClass: '',
    skeletonRows: 3,
    skeletonDelay: 180,
  },
)

const emit = defineEmits<{
  (e: 'rowClick', row: Row<TData>): void
}>()

const showSkeleton = useDelayedSkeleton(() => props.loading, props.skeletonDelay)

const table = useVueTable({
  get data() {
    return props.rows
  },
  get columns() {
    return props.columns
  },
  getCoreRowModel: getCoreRowModel(),
})

function columnStyle(column: { getSize: () => number }) {
  const width = column.getSize()
  if (!Number.isFinite(width) || width === 150) {
    return undefined
  }

  return {
    minWidth: `${width}px`,
    width: `${width}px`,
    maxWidth: `${width}px`,
  }
}
</script>