<template>
  <AdminLayout>
    <div class="mx-auto max-w-[1600px] space-y-6">
      <header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 class="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Tình hình định danh
          </h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Tổng hợp toàn tỉnh, so sánh theo địa bàn và tra cứu nhanh từng đơn vị.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <span v-if="dashboard" class="text-xs text-gray-500 dark:text-gray-400">
            Cập nhật {{ formatDate(dashboard.generatedAt) }}
          </span>
          <button
            type="button"
            class="inline-flex h-10 items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 active:translate-y-px dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            :disabled="loading"
            @click="loadDashboard"
          >
            <RefreshCw class="h-4 w-4" :class="{ 'animate-spin': loading }" />
            Làm mới
          </button>
        </div>
      </header>

      <div v-if="loading" class="grid gap-5 xl:grid-cols-2">
        <div v-for="item in 6" :key="item" class="h-72 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800"></div>
      </div>

      <div
        v-else-if="error"
        class="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
      >
        <p class="font-medium">Không thể tải dashboard</p>
        <p class="mt-1 text-sm">{{ error }}</p>
        <button type="button" class="mt-4 text-sm font-semibold underline" @click="loadDashboard">
          Thử lại
        </button>
      </div>

      <template v-else-if="dashboard">
        <section class="space-y-4">
          <div class="flex items-center gap-3">
            <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
              <Building2 class="h-5 w-5" />
            </span>
            <div>
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Doanh nghiệp</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">Theo trạng thái định danh hiện tại</p>
            </div>
          </div>

          <div class="grid gap-5 xl:grid-cols-12">
            <ComponentCard
              title="Toàn tỉnh"
              desc="Tổng quan định danh doanh nghiệp"
              class-name="xl:col-span-4"
            >
              <div class="grid grid-cols-[minmax(0,1fr)_150px] items-center gap-3">
                <div class="space-y-4">
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Tổng doanh nghiệp</p>
                    <p class="mt-1 text-3xl font-semibold tabular-nums text-gray-900 dark:text-white">
                      {{ formatNumber(dashboard.overview.totalCompanies) }}
                    </p>
                  </div>
                  <IdentityMetrics :identity="dashboard.identity" />
                </div>
                <VueApexCharts
                  type="donut"
                  height="180"
                  :options="buildDonutOptions(dashboard.overview.totalCompanies)"
                  :series="buildIdentitySeries(dashboard.identity)"
                />
              </div>
            </ComponentCard>

            <ComponentCard
              title="Theo địa bàn"
              desc="Group theo danh mục hành chính đã đồng bộ từ API"
              class-name="xl:col-span-8"
            >
              <template #header-right>
                <select
                  v-model="companyAreaKey"
                  class="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none focus:border-brand-500 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                >
                  <option v-for="option in areaOptions" :key="option.key" :value="option.key">
                    {{ option.label }}
                  </option>
                </select>
              </template>
              <div v-if="companyAreas.length" class="max-h-[390px] overflow-y-auto">
                <VueApexCharts
                  type="bar"
                  :height="areaChartHeight(companyAreas)"
                  :options="buildAreaChartOptions(companyAreas)"
                  :series="buildAreaChartSeries(companyAreas)"
                />
              </div>
              <EmptyArea v-else />
            </ComponentCard>

            <ComponentCard
              title="Tra cứu một địa bàn"
              :desc="`Tra cứu ${selectedCompanyAreaLabel.toLowerCase()} trong danh mục hành chính`"
              class-name="xl:col-span-12"
            >
              <AreaLookup
                v-model:search="companySearch"
                v-model:selected-id="selectedCompanyAreaId"
                :areas="companyAreas"
                entity-label="doanh nghiệp"
              />
            </ComponentCard>
          </div>
        </section>

        <section class="space-y-4 border-t border-gray-200 pt-6 dark:border-gray-800">
          <div class="flex items-center gap-3">
            <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300">
              <UsersRound class="h-5 w-5" />
            </span>
            <div>
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Hợp tác xã</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">Theo liên kết và trạng thái dữ liệu thuế</p>
            </div>
          </div>

          <div class="grid gap-5 xl:grid-cols-12">
            <ComponentCard
              title="Toàn tỉnh"
              desc="Tổng quan định danh hợp tác xã"
              class-name="xl:col-span-4"
            >
              <div class="grid grid-cols-[minmax(0,1fr)_150px] items-center gap-3">
                <div class="space-y-4">
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Tổng hợp tác xã</p>
                    <p class="mt-1 text-3xl font-semibold tabular-nums text-gray-900 dark:text-white">
                      {{ formatNumber(dashboard.cooperativeOverview?.totalCooperatives ?? 0) }}
                    </p>
                  </div>
                  <IdentityMetrics :identity="cooperativeIdentity" />
                </div>
                <VueApexCharts
                  type="donut"
                  height="180"
                  :options="buildDonutOptions(dashboard.cooperativeOverview?.totalCooperatives ?? 0)"
                  :series="buildIdentitySeries(cooperativeIdentity)"
                />
              </div>
            </ComponentCard>

            <ComponentCard
              title="Theo địa bàn"
              desc="Group theo danh mục hành chính đã đồng bộ từ API"
              class-name="xl:col-span-8"
            >
              <template #header-right>
                <select
                  v-model="cooperativeAreaKey"
                  class="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none focus:border-brand-500 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                >
                  <option v-for="option in areaOptions" :key="option.key" :value="option.key">
                    {{ option.label }}
                  </option>
                </select>
              </template>
              <div v-if="cooperativeAreas.length" class="max-h-[390px] overflow-y-auto">
                <VueApexCharts
                  type="bar"
                  :height="areaChartHeight(cooperativeAreas)"
                  :options="buildAreaChartOptions(cooperativeAreas)"
                  :series="buildAreaChartSeries(cooperativeAreas)"
                />
              </div>
              <EmptyArea v-else />
            </ComponentCard>

            <ComponentCard
              title="Tra cứu một địa bàn"
              :desc="`Tra cứu ${selectedCooperativeAreaLabel.toLowerCase()} trong danh mục hành chính`"
              class-name="xl:col-span-12"
            >
              <AreaLookup
                v-model:search="cooperativeSearch"
                v-model:selected-id="selectedCooperativeAreaId"
                :areas="cooperativeAreas"
                entity-label="hợp tác xã"
              />
            </ComponentCard>
          </div>
        </section>
      </template>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, onMounted, ref, watch, type PropType } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { Building2, CheckCircle2, CircleDashed, MapPinned, RefreshCw, Search, TriangleAlert, UsersRound } from 'lucide-vue-next'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import { dashboardService } from '@/services/dashboardService'
import type {
  DashboardAreaIdentity,
  DashboardAreaKey,
  DashboardAreaOption,
  DashboardData,
  DashboardIdentity,
} from '@/types/dashboard'

const identityLabels = ['Đã định danh', 'Cần rà soát', 'Chưa định danh']
const identityColors = ['#12b76a', '#f79009', '#98a2b3']
const chartFont = 'Outfit, sans-serif'

const loading = ref(true)
const error = ref<string | null>(null)
const dashboard = ref<DashboardData | null>(null)
const companySearch = ref('')
const cooperativeSearch = ref('')
const selectedCompanyAreaId = ref<string>('')
const selectedCooperativeAreaId = ref<string>('')
const companyAreaKey = ref<DashboardAreaKey>('quanHuyenMoi')
const cooperativeAreaKey = ref<DashboardAreaKey>('quanHuyenMoi')

const defaultAreaOptions: DashboardAreaOption[] = [
  { key: 'quanHuyenMoi', label: 'Quận / Huyện mới' },
  { key: 'quanHuyenCu', label: 'Quận / Huyện cũ' },
  { key: 'phuongXaMoi', label: 'Phường / Xã / Thị trấn mới' },
  { key: 'phuongXaCu', label: 'Phường / Xã / Thị trấn cũ' },
]
const areaOptions = computed(() => dashboard.value?.areaOptions ?? defaultAreaOptions)
const companyAreas = computed(
  () => dashboard.value?.companyAreaBreakdowns?.[companyAreaKey.value] ?? [],
)
const cooperativeAreas = computed(
  () => dashboard.value?.cooperativeAreaBreakdowns?.[cooperativeAreaKey.value] ?? [],
)
const selectedCompanyAreaLabel = computed(
  () => areaOptions.value.find((option) => option.key === companyAreaKey.value)?.label ?? '',
)
const selectedCooperativeAreaLabel = computed(
  () => areaOptions.value.find((option) => option.key === cooperativeAreaKey.value)?.label ?? '',
)
const cooperativeIdentity = computed<DashboardIdentity>(() =>
  dashboard.value?.cooperativeIdentity ?? { daDinhDanh: 0, canRaSoat: 0, chuaDinhDanh: 0 },
)

const formatNumber = (value: number) => new Intl.NumberFormat('vi-VN').format(value)

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleString('vi-VN')
  } catch {
    return iso
  }
}

function areaKey(area: DashboardAreaIdentity) {
  return area.areaCode ?? 'unlinked'
}

function buildIdentitySeries(identity: DashboardIdentity) {
  return [identity.daDinhDanh, identity.canRaSoat, identity.chuaDinhDanh]
}

function buildDonutOptions(total: number) {
  return {
    chart: { fontFamily: chartFont, toolbar: { show: false }, sparkline: { enabled: false } },
    colors: identityColors,
    labels: identityLabels,
    stroke: { width: 2, colors: ['transparent'] },
    legend: { show: false },
    dataLabels: { enabled: false },
    tooltip: { y: { formatter: (value: number) => formatNumber(value) } },
    plotOptions: {
      pie: {
        donut: {
          size: '72%',
          labels: {
            show: true,
            name: { show: true, fontSize: '12px', color: '#667085' },
            value: { show: true, fontSize: '18px', fontWeight: 600, formatter: (value: string) => formatNumber(Number(value)) },
            total: { show: true, label: 'Tổng', formatter: () => formatNumber(total) },
          },
        },
      },
    },
  }
}

function sortedAreas(areas: DashboardAreaIdentity[]) {
  return [...areas]
}

function areaChartHeight(areas: DashboardAreaIdentity[]) {
  return Math.max(270, sortedAreas(areas).length * 44)
}

function buildAreaChartOptions(areas: DashboardAreaIdentity[]) {
  const rows = sortedAreas(areas)
  return {
    chart: { fontFamily: chartFont, stacked: true, toolbar: { show: false }, animations: { enabled: false } },
    colors: identityColors,
    plotOptions: { bar: { horizontal: true, barHeight: '62%', borderRadius: 3 } },
    dataLabels: { enabled: false },
    xaxis: {
      categories: rows.map((area) => area.areaName),
      labels: { formatter: (value: number) => formatNumber(Math.round(value)), style: { colors: '#667085' } },
    },
    yaxis: { labels: { maxWidth: 220, style: { colors: '#475467', fontSize: '12px' } } },
    legend: { position: 'top', horizontalAlign: 'left', markers: { size: 5 } },
    grid: { borderColor: '#eaecf0', strokeDashArray: 3 },
    tooltip: { y: { formatter: (value: number) => formatNumber(value) } },
  }
}

function buildAreaChartSeries(areas: DashboardAreaIdentity[]) {
  const rows = sortedAreas(areas)
  return [
    { name: identityLabels[0], data: rows.map((area) => area.daDinhDanh) },
    { name: identityLabels[1], data: rows.map((area) => area.canRaSoat) },
    { name: identityLabels[2], data: rows.map((area) => area.chuaDinhDanh) },
  ]
}

const IdentityMetrics = defineComponent({
  props: {
    identity: { type: Object as PropType<DashboardIdentity>, required: true },
  },
  setup(props) {
    const rows = computed(() => [
      { label: identityLabels[0], value: props.identity.daDinhDanh, icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400' },
      { label: identityLabels[1], value: props.identity.canRaSoat, icon: TriangleAlert, color: 'text-amber-600 dark:text-amber-400' },
      { label: identityLabels[2], value: props.identity.chuaDinhDanh, icon: CircleDashed, color: 'text-gray-500 dark:text-gray-400' },
    ])
    return () => h('div', { class: 'space-y-2.5' }, rows.value.map((row) =>
      h('div', { class: 'flex items-center justify-between gap-3 text-sm' }, [
        h('span', { class: 'flex items-center gap-2 text-gray-600 dark:text-gray-300' }, [
          h(row.icon, { class: `h-4 w-4 ${row.color}` }),
          row.label,
        ]),
        h('strong', { class: 'tabular-nums text-gray-900 dark:text-white' }, formatNumber(row.value)),
      ]),
    ))
  },
})

const EmptyArea = defineComponent({
  setup() {
    return () => h('div', { class: 'flex min-h-64 flex-col items-center justify-center text-center' }, [
      h(MapPinned, { class: 'h-8 w-8 text-gray-300 dark:text-gray-600' }),
      h('p', { class: 'mt-3 text-sm font-medium text-gray-700 dark:text-gray-300' }, 'Chưa có số liệu theo địa bàn'),
      h('p', { class: 'mt-1 text-xs text-gray-500 dark:text-gray-400' }, 'Dữ liệu sẽ xuất hiện khi đơn vị được gắn địa bàn.'),
    ])
  },
})

const AreaLookup = defineComponent({
  props: {
    areas: { type: Array as PropType<DashboardAreaIdentity[]>, required: true },
    search: { type: String, required: true },
    selectedId: { type: String, required: true },
    entityLabel: { type: String, required: true },
  },
  emits: ['update:search', 'update:selectedId'],
  setup(props, { emit }) {
    const normalize = (value: string) =>
      value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
    const matches = computed(() => {
      const term = normalize(props.search)
      const rows = sortedAreas(props.areas)
      return term ? rows.filter((area) => normalize(area.areaName).includes(term)) : rows
    })
    const selected = computed(() =>
      props.areas.find((area) => areaKey(area) === props.selectedId) ?? matches.value[0] ?? null,
    )
    watch(matches, (rows) => {
      if (rows.length && !rows.some((area) => areaKey(area) === props.selectedId)) {
        emit('update:selectedId', areaKey(rows[0]))
      }
    }, { immediate: true })

    return () => h('div', { class: 'grid gap-5 lg:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.2fr)]' }, [
      h('div', [
        h('label', { class: 'mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300' }, 'Tên địa bàn'),
        h('div', { class: 'relative' }, [
          h(Search, { class: 'pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' }),
          h('input', {
            value: props.search,
            type: 'search',
            placeholder: 'Nhập tên địa bàn...',
            class: 'h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white',
            onInput: (event: Event) => emit('update:search', (event.target as HTMLInputElement).value),
          }),
        ]),
        h('div', { class: 'mt-2 max-h-40 space-y-1 overflow-y-auto' },
          matches.value.length
            ? matches.value.slice(0, 8).map((area) => h('button', {
              type: 'button',
              class: [
                'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition',
                areaKey(area) === areaKey(selected.value!)
                  ? 'bg-brand-50 font-medium text-brand-700 dark:bg-brand-950/30 dark:text-brand-300'
                  : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800',
              ],
              onClick: () => emit('update:selectedId', areaKey(area)),
            }, [
              h('span', { class: 'truncate' }, area.areaName),
              h('span', { class: 'ml-3 tabular-nums text-xs text-gray-500' }, formatNumber(area.total)),
            ]))
            : [h('p', { class: 'px-3 py-4 text-sm text-gray-500' }, 'Không tìm thấy địa bàn phù hợp.')],
        ),
      ]),
      selected.value
        ? h('div', { class: 'rounded-xl bg-gray-50 p-4 dark:bg-gray-800/60 sm:p-5' }, [
          h('div', { class: 'flex items-start justify-between gap-4' }, [
            h('div', [
              h('div', { class: 'flex items-center gap-2' }, [
                h(MapPinned, { class: 'h-4 w-4 text-brand-500' }),
                h('h4', { class: 'font-semibold text-gray-900 dark:text-white' }, selected.value.areaName),
              ]),
              h('p', { class: 'mt-1 text-sm text-gray-500 dark:text-gray-400' }, `Số liệu ${props.entityLabel} tại địa bàn`),
            ]),
            h('div', { class: 'text-right' }, [
              h('p', { class: 'text-xs text-gray-500 dark:text-gray-400' }, 'Tổng số'),
              h('p', { class: 'text-2xl font-semibold tabular-nums text-gray-900 dark:text-white' }, formatNumber(selected.value.total)),
            ]),
          ]),
          h('div', { class: 'mt-5 grid gap-3 sm:grid-cols-3' }, [
            ['Đã định danh', selected.value.daDinhDanh, 'text-emerald-600 dark:text-emerald-400'],
            ['Cần rà soát', selected.value.canRaSoat, 'text-amber-600 dark:text-amber-400'],
            ['Chưa định danh', selected.value.chuaDinhDanh, 'text-gray-600 dark:text-gray-300'],
          ].map(([label, value, color]) => h('div', { class: 'rounded-lg bg-white p-3 dark:bg-gray-900' }, [
            h('p', { class: 'text-xs text-gray-500 dark:text-gray-400' }, label),
            h('p', { class: `mt-1 text-xl font-semibold tabular-nums ${color}` }, formatNumber(value as number)),
          ]))),
        ])
        : h('div', { class: 'flex min-h-48 items-center justify-center rounded-xl bg-gray-50 text-sm text-gray-500 dark:bg-gray-800/60' }, 'Chưa có dữ liệu địa bàn.'),
    ])
  },
})

async function loadDashboard() {
  loading.value = true
  error.value = null
  try {
    dashboard.value = await dashboardService.getDashboard()
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } }
    error.value = axiosErr.response?.data?.message ?? 'Không thể tải dữ liệu dashboard.'
  } finally {
    loading.value = false
  }
}

onMounted(loadDashboard)
</script>
