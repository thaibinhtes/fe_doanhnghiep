<template>
  <AdminLayout>
    <div class="space-y-5 sm:space-y-6">
      <div v-if="loading" class="flex items-center justify-center py-16">
        <div class="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500"></div>
      </div>

      <template v-else-if="dashboard">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Cập nhật lúc: {{ formatDate(dashboard.generatedAt) }}
          </p>
          <button
            @click="loadDashboard"
            class="inline-flex h-10 items-center justify-center rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Làm mới
          </button>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div
            v-for="card in statCards"
            :key="card.label"
            class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]"
          >
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ card.label }}</p>
            <p class="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{{ card.value }}</p>
          </div>
        </div>

        <div class="grid gap-5 xl:grid-cols-2">
          <ComponentCard title="Tỷ lệ định danh doanh nghiệp">
            <VueApexCharts type="donut" height="320" :options="identityChartOptions" :series="identitySeries" />
          </ComponentCard>

          <ComponentCard title="Phân bổ trạng thái (báo cáo tổng hợp)">
            <VueApexCharts type="pie" height="320" :options="summaryChartOptions" :series="summarySeries" />
          </ComponentCard>
        </div>

        <ComponentCard title="Tiến độ định danh theo kỳ báo cáo">
          <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
            {{ dashboard.progress.title }} · {{ dashboard.progress.reportDateLabel }}
          </p>
          <VueApexCharts type="bar" height="360" :options="progressChartOptions" :series="progressSeries" />
        </ComponentCard>

        <ComponentCard title="Số lượng theo trạng thái báo cáo">
          <VueApexCharts type="bar" height="360" :options="summaryBarOptions" :series="summaryBarSeries" />
        </ComponentCard>
      </template>

      <div v-else-if="error" class="rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
        {{ error }}
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import { dashboardService } from '@/services/dashboardService'
import type { DashboardData } from '@/types/dashboard'
import type { ProgressReportMetrics } from '@/types/report'

const loading = ref(true)
const error = ref<string | null>(null)
const dashboard = ref<DashboardData | null>(null)

const chartFont = 'Outfit, sans-serif'
const chartColors = ['#465fff', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#64748b']

const statCards = computed(() => {
  if (!dashboard.value) return []
  const o = dashboard.value.overview
  return [
    { label: 'Tổng doanh nghiệp', value: o.totalCompanies },
    { label: 'Đã định danh', value: o.identified },
    { label: 'Chưa định danh', value: o.notIdentified },
    { label: 'Có tọa độ bản đồ', value: o.withCoordinates },
  ]
})

const identitySeries = computed(() => {
  if (!dashboard.value) return []
  return [dashboard.value.identity.daDinhDanh, dashboard.value.identity.chuaDinhDanh]
})

const identityChartOptions = computed(() => ({
  chart: { fontFamily: chartFont, type: 'donut' },
  colors: ['#10b981', '#f59e0b'],
  labels: ['Đã định danh', 'Chưa định danh'],
  legend: { position: 'bottom' },
  dataLabels: { enabled: true },
  plotOptions: {
    pie: {
      donut: {
        size: '62%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Tổng',
            formatter: () => String(dashboard.value?.overview.totalCompanies ?? 0),
          },
        },
      },
    },
  },
}))

const summarySeries = computed(() => {
  if (!dashboard.value) return []
  return dashboard.value.summary.columns.map((col) => col.count)
})

const summaryChartOptions = computed(() => ({
  chart: { fontFamily: chartFont, type: 'pie' },
  colors: chartColors,
  labels: dashboard.value?.summary.columns.map((col) => col.ten) ?? [],
  legend: { position: 'bottom' },
  dataLabels: { enabled: true },
}))

const summaryBarSeries = computed(() => [
  {
    name: 'Số lượng',
    data: dashboard.value?.summary.columns.map((col) => col.count) ?? [],
  },
])

const summaryBarOptions = computed(() => ({
  chart: { fontFamily: chartFont, type: 'bar', toolbar: { show: false } },
  colors: ['#465fff'],
  plotOptions: { bar: { borderRadius: 6, columnWidth: '45%' } },
  dataLabels: { enabled: false },
  xaxis: {
    categories: dashboard.value?.summary.columns.map((col) => col.ten) ?? [],
    labels: { rotate: -30, trim: true },
  },
  yaxis: { labels: { formatter: (val: number) => Math.round(val).toString() } },
  grid: { strokeDashArray: 4 },
}))

const progressSeries = computed(() => {
  const totalRow = dashboard.value?.progress.totalRow
  const ranges = dashboard.value?.progress.ranges ?? []
  if (!totalRow || ranges.length === 0) return []

  const metrics: Array<keyof ProgressReportMetrics> = ['daDinhDanh', 'chuaDinhDanh', 'canDinhDanh']

  return ranges.map((range) => ({
    name: range.label,
    data: metrics.map((key) => totalRow.periods[range.key]?.[key] ?? 0),
  }))
})

const progressChartOptions = computed(() => {
  const labels = dashboard.value?.progress.metricLabels
  const categories = labels
    ? [labels.daDinhDanh, labels.chuaDinhDanh, labels.canDinhDanh]
    : ['Đã định danh', 'Chưa định danh', 'Cần định danh']

  return {
    chart: { fontFamily: chartFont, type: 'bar', toolbar: { show: false } },
    colors: ['#465fff', '#10b981'],
    plotOptions: { bar: { borderRadius: 6, columnWidth: '55%' } },
    dataLabels: { enabled: false },
    xaxis: { categories },
    legend: { position: 'top' },
    grid: { strokeDashArray: 4 },
  }
})

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleString('vi-VN')
  } catch {
    return iso
  }
}

const loadDashboard = async () => {
  loading.value = true
  error.value = null
  try {
    dashboard.value = await dashboardService.getDashboard()
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } }
    error.value = axiosErr.response?.data?.message ?? 'Không thể tải dữ liệu dashboard'
  } finally {
    loading.value = false
  }
}

onMounted(loadDashboard)
</script>
