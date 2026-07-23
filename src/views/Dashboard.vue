<template>
  <AdminLayout>
    <div class="mx-auto max-w-[1600px] space-y-8">
      <header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Tình hình định danh
          </h1>
          <p class="mt-2 text-base text-gray-600 dark:text-gray-300">
            Xem tổng quan toàn tỉnh và số liệu theo từng địa bàn hành chính.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <span v-if="dashboard" class="text-sm text-gray-500 dark:text-gray-400">
            Cập nhật {{ formatDate(dashboard.generatedAt) }}
          </span>
          <button
            type="button"
            class="inline-flex h-12 items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 text-base font-semibold text-gray-800 transition hover:bg-gray-50 active:translate-y-px dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
            :disabled="overviewLoading"
            @click="refreshAll"
          >
            <RefreshCw class="h-5 w-5" :class="{ 'animate-spin': overviewLoading || companyAreasLoading || cooperativeAreasLoading }" />
            Làm mới
          </button>
        </div>
      </header>

      <DashboardSkeleton v-if="overviewLoading && !dashboard" />

      <div
        v-else-if="overviewError && !dashboard"
        class="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
      >
        <p class="text-lg font-semibold">Không thể tải dashboard</p>
        <p class="mt-1 text-base">{{ overviewError }}</p>
        <button type="button" class="mt-4 text-base font-semibold underline" @click="loadOverview">
          Thử lại
        </button>
      </div>

      <template v-else-if="dashboard">
        <!-- Doanh nghiệp -->
        <section class="space-y-5">
          <div class="flex items-center gap-3">
            <span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
              <Building2 class="h-6 w-6" />
            </span>
            <div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Doanh nghiệp</h2>
              <p class="text-base text-gray-600 dark:text-gray-300">Theo trạng thái định danh</p>
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
                    <p class="text-base text-gray-600 dark:text-gray-300">Tổng doanh nghiệp</p>
                    <p class="mt-1 text-4xl font-bold tabular-nums text-gray-900 dark:text-white">
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
              title="Theo địa bàn hành chính"
              desc="Bảng thống kê — bấm vào một dòng để mở danh sách doanh nghiệp"
              class-name="xl:col-span-8"
            >
              <template #header-right>
                <select
                  v-model="companyAreaKey"
                  class="h-12 min-w-[220px] rounded-xl border border-gray-300 bg-white px-4 text-base font-medium text-gray-800 outline-none focus:border-brand-500 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                >
                  <option v-for="option in areaOptions" :key="option.key" :value="option.key">
                    {{ option.label }}
                  </option>
                </select>
              </template>

              <div v-if="companyAreasLoading" class="flex min-h-[240px] items-center justify-center text-base text-gray-500">
                Đang tải địa bàn...
              </div>
              <div v-else-if="companyAreasError" class="rounded-xl bg-red-50 px-4 py-4 text-base text-red-700 dark:bg-red-950/30 dark:text-red-300">
                {{ companyAreasError }}
                <button type="button" class="ml-2 font-semibold underline" @click="loadCompanyAreas(true)">Thử lại</button>
              </div>
              <AreaStatsTable
                v-else-if="companyAreas.length"
                v-model:search="companySearch"
                :areas="companyAreas"
                clickable
                @select="(area) => navigateFromAreaChart(companyAreaKey, area)"
              />
              <EmptyArea v-else />
            </ComponentCard>
          </div>
        </section>

        <!-- Hợp tác xã -->
        <section class="space-y-5 border-t border-gray-200 pt-8 dark:border-gray-800">
          <div class="flex items-center gap-3">
            <span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              <UsersRound class="h-6 w-6" />
            </span>
            <div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Hợp tác xã</h2>
              <p class="text-base text-gray-600 dark:text-gray-300">Theo liên kết và trạng thái dữ liệu thuế</p>
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
                    <p class="text-base text-gray-600 dark:text-gray-300">Tổng hợp tác xã</p>
                    <p class="mt-1 text-4xl font-bold tabular-nums text-gray-900 dark:text-white">
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
              title="Theo địa bàn hành chính"
              desc="Bảng thống kê theo danh mục hành chính đã đồng bộ"
              class-name="xl:col-span-8"
            >
              <template #header-right>
                <select
                  v-model="cooperativeAreaKey"
                  class="h-12 min-w-[220px] rounded-xl border border-gray-300 bg-white px-4 text-base font-medium text-gray-800 outline-none focus:border-brand-500 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                >
                  <option v-for="option in areaOptions" :key="option.key" :value="option.key">
                    {{ option.label }}
                  </option>
                </select>
              </template>

              <div v-if="cooperativeAreasLoading" class="flex min-h-[240px] items-center justify-center text-base text-gray-500">
                Đang tải địa bàn...
              </div>
              <div v-else-if="cooperativeAreasError" class="rounded-xl bg-red-50 px-4 py-4 text-base text-red-700 dark:bg-red-950/30 dark:text-red-300">
                {{ cooperativeAreasError }}
                <button type="button" class="ml-2 font-semibold underline" @click="loadCooperativeAreas(true)">Thử lại</button>
              </div>
              <AreaStatsTable
                v-else-if="cooperativeAreas.length"
                v-model:search="cooperativeSearch"
                :areas="cooperativeAreas"
              />
              <EmptyArea v-else />
            </ComponentCard>
          </div>
        </section>
      </template>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, onMounted, ref, watch, type PropType } from 'vue'
import { useRouter } from 'vue-router'
import VueApexCharts from 'vue3-apexcharts'
import { Building2, CheckCircle2, CircleDashed, MapPinned, RefreshCw, Search, TriangleAlert, UsersRound } from 'lucide-vue-next'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton.vue'
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

const router = useRouter()
const overviewLoading = ref(true)
const overviewError = ref<string | null>(null)
const dashboard = ref<DashboardData | null>(null)
const companySearch = ref('')
const cooperativeSearch = ref('')
const companyAreaKey = ref<DashboardAreaKey>('quanHuyenMoi')
const cooperativeAreaKey = ref<DashboardAreaKey>('quanHuyenMoi')
const companyAreasCache = ref<Partial<Record<DashboardAreaKey, DashboardAreaIdentity[]>>>({})
const cooperativeAreasCache = ref<Partial<Record<DashboardAreaKey, DashboardAreaIdentity[]>>>({})
const companyAreasLoading = ref(false)
const cooperativeAreasLoading = ref(false)
const companyAreasError = ref<string | null>(null)
const cooperativeAreasError = ref<string | null>(null)
let companyAreasRequestId = 0
let cooperativeAreasRequestId = 0

const defaultAreaOptions: DashboardAreaOption[] = [
  { key: 'quanHuyenMoi', label: 'Quận / Huyện mới' },
  { key: 'quanHuyenCu', label: 'Quận / Huyện cũ' },
  { key: 'phuongXaMoi', label: 'Phường / Xã / Thị trấn mới' },
  { key: 'phuongXaCu', label: 'Phường / Xã / Thị trấn cũ' },
]
const areaOptions = computed(() => dashboard.value?.areaOptions ?? defaultAreaOptions)
const companyAreas = computed(() => companyAreasCache.value[companyAreaKey.value] ?? [])
const cooperativeAreas = computed(() => cooperativeAreasCache.value[cooperativeAreaKey.value] ?? [])
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
            name: { show: true, fontSize: '13px', color: '#667085' },
            value: { show: true, fontSize: '20px', fontWeight: 700, formatter: (value: string) => formatNumber(Number(value)) },
            total: { show: true, label: 'Tổng', formatter: () => formatNumber(total) },
          },
        },
      },
    },
  }
}

function navigateFromAreaChart(areaKey: DashboardAreaKey, area: DashboardAreaIdentity) {
  const areaId = area.areaCode ?? 'unlinked'
  const areaLabel = areaOptions.value.find((option) => option.key === areaKey)?.label ?? areaKey

  void router.push({
    name: 'Companies',
    query: {
      hanhChinhAreaKey: areaKey,
      hanhChinhAreaId: areaId,
      hanhChinhAreaName: area.areaName,
      hanhChinhAreaLabel: areaLabel,
    },
  })
}

const IdentityMetrics = defineComponent({
  props: {
    identity: { type: Object as PropType<DashboardIdentity>, required: true },
  },
  setup(props) {
    const rows = computed(() => [
      { label: 'Đã định danh', value: props.identity.daDinhDanh, icon: CheckCircle2, color: 'text-emerald-700 dark:text-emerald-400' },
      { label: 'Chưa định danh', value: props.identity.chuaDinhDanh, icon: CircleDashed, color: 'text-gray-600 dark:text-gray-300' },
      { label: 'Cần rà soát', value: props.identity.canRaSoat, icon: TriangleAlert, color: 'text-amber-700 dark:text-amber-400' },
    ])
    return () => h('div', { class: 'space-y-3' }, rows.value.map((row) =>
      h('div', { class: 'flex items-center justify-between gap-3 text-base' }, [
        h('span', { class: 'flex items-center gap-2.5 font-medium text-gray-700 dark:text-gray-200' }, [
          h(row.icon, { class: `h-5 w-5 ${row.color}` }),
          row.label,
        ]),
        h('strong', { class: `text-xl tabular-nums ${row.color}` }, formatNumber(row.value)),
      ]),
    ))
  },
})

const EmptyArea = defineComponent({
  setup() {
    return () => h('div', { class: 'flex min-h-56 flex-col items-center justify-center text-center' }, [
      h(MapPinned, { class: 'h-10 w-10 text-gray-300 dark:text-gray-600' }),
      h('p', { class: 'mt-3 text-lg font-semibold text-gray-700 dark:text-gray-200' }, 'Chưa có số liệu theo địa bàn'),
      h('p', { class: 'mt-1 text-base text-gray-500 dark:text-gray-400' }, 'Dữ liệu sẽ xuất hiện khi đơn vị được gắn địa bàn.'),
    ])
  },
})

const AreaStatsTable = defineComponent({
  props: {
    areas: { type: Array as PropType<DashboardAreaIdentity[]>, required: true },
    search: { type: String, required: true },
    clickable: { type: Boolean, default: false },
  },
  emits: ['update:search', 'select'],
  setup(props, { emit }) {
    const normalize = (value: string) =>
      value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()

    const rows = computed(() => {
      const term = normalize(props.search)
      const list = [...props.areas]
      const filtered = term
        ? list.filter((area) => normalize(area.areaName).includes(term))
        : list
      return filtered
    })

    const totals = computed(() =>
      rows.value.reduce(
        (acc, area) => {
          acc.daDinhDanh += area.daDinhDanh
          acc.chuaDinhDanh += area.chuaDinhDanh
          acc.canRaSoat += area.canRaSoat
          acc.total += area.total
          return acc
        },
        { daDinhDanh: 0, chuaDinhDanh: 0, canRaSoat: 0, total: 0 },
      ),
    )

    return () => h('div', { class: 'space-y-4' }, [
      h('div', { class: 'relative' }, [
        h(Search, { class: 'pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' }),
        h('input', {
          value: props.search,
          type: 'search',
          placeholder: 'Tìm theo tên địa bàn...',
          class: 'h-12 w-full rounded-xl border border-gray-300 bg-white pl-12 pr-4 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white',
          onInput: (event: Event) => emit('update:search', (event.target as HTMLInputElement).value),
        }),
      ]),

      h('div', { class: 'overflow-x-auto rounded-xl border-2 border-gray-200 dark:border-gray-700' }, [
        h('table', { class: 'min-w-full border-collapse text-left' }, [
          h('thead', { class: 'bg-gray-100 dark:bg-gray-800' }, [
            h('tr', [
              h('th', { class: 'border-b-2 border-gray-200 px-4 py-4 text-base font-bold text-gray-800 dark:border-gray-700 dark:text-gray-100' }, 'Tên địa bàn'),
              h('th', { class: 'border-b-2 border-gray-200 px-4 py-4 text-right text-base font-bold text-emerald-800 dark:border-gray-700 dark:text-emerald-300' }, 'Đã định danh'),
              h('th', { class: 'border-b-2 border-gray-200 px-4 py-4 text-right text-base font-bold text-gray-700 dark:border-gray-700 dark:text-gray-200' }, 'Chưa định danh'),
              h('th', { class: 'border-b-2 border-gray-200 px-4 py-4 text-right text-base font-bold text-amber-800 dark:border-gray-700 dark:text-amber-300' }, 'Cần rà soát'),
              h('th', { class: 'border-b-2 border-gray-200 px-4 py-4 text-right text-base font-bold text-gray-800 dark:border-gray-700 dark:text-gray-100' }, 'Tổng'),
            ]),
          ]),
          h('tbody', rows.value.length
            ? rows.value.map((area, index) =>
              h('tr', {
                key: `${area.areaCode ?? 'unlinked'}-${area.areaName}`,
                class: [
                  index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-900/60',
                  props.clickable
                    ? 'cursor-pointer transition hover:bg-brand-50 dark:hover:bg-brand-950/30'
                    : '',
                ],
                onClick: props.clickable ? () => emit('select', area) : undefined,
                title: props.clickable ? 'Bấm để xem danh sách doanh nghiệp' : undefined,
              }, [
                h('td', { class: 'border-b border-gray-200 px-4 py-3.5 text-base font-semibold text-gray-900 dark:border-gray-800 dark:text-white' }, area.areaName),
                h('td', { class: 'border-b border-gray-200 px-4 py-3.5 text-right text-lg font-bold tabular-nums text-emerald-700 dark:border-gray-800 dark:text-emerald-400' }, formatNumber(area.daDinhDanh)),
                h('td', { class: 'border-b border-gray-200 px-4 py-3.5 text-right text-lg font-bold tabular-nums text-gray-700 dark:border-gray-800 dark:text-gray-200' }, formatNumber(area.chuaDinhDanh)),
                h('td', { class: 'border-b border-gray-200 px-4 py-3.5 text-right text-lg font-bold tabular-nums text-amber-700 dark:border-gray-800 dark:text-amber-400' }, formatNumber(area.canRaSoat)),
                h('td', { class: 'border-b border-gray-200 px-4 py-3.5 text-right text-lg font-bold tabular-nums text-gray-900 dark:border-gray-800 dark:text-white' }, formatNumber(area.total)),
              ]),
            )
            : [
              h('tr', [
                h('td', {
                  colspan: 5,
                  class: 'px-4 py-10 text-center text-base text-gray-500 dark:text-gray-400',
                }, 'Không tìm thấy địa bàn phù hợp.'),
              ]),
            ],
          ),
          rows.value.length
            ? h('tfoot', { class: 'bg-gray-100 dark:bg-gray-800' }, [
              h('tr', [
                h('td', { class: 'px-4 py-4 text-base font-bold text-gray-900 dark:text-white' }, `Cộng (${formatNumber(rows.value.length)} địa bàn)`),
                h('td', { class: 'px-4 py-4 text-right text-lg font-bold tabular-nums text-emerald-800 dark:text-emerald-300' }, formatNumber(totals.value.daDinhDanh)),
                h('td', { class: 'px-4 py-4 text-right text-lg font-bold tabular-nums text-gray-800 dark:text-gray-100' }, formatNumber(totals.value.chuaDinhDanh)),
                h('td', { class: 'px-4 py-4 text-right text-lg font-bold tabular-nums text-amber-800 dark:text-amber-300' }, formatNumber(totals.value.canRaSoat)),
                h('td', { class: 'px-4 py-4 text-right text-lg font-bold tabular-nums text-gray-900 dark:text-white' }, formatNumber(totals.value.total)),
              ]),
            ])
            : null,
        ]),
      ]),

      props.clickable
        ? h('p', { class: 'text-sm text-gray-500 dark:text-gray-400' }, 'Mẹo: bấm vào một dòng trong bảng để mở danh sách doanh nghiệp của địa bàn đó.')
        : null,
    ])
  },
})

async function loadOverview() {
  overviewLoading.value = true
  overviewError.value = null
  try {
    dashboard.value = await dashboardService.getOverview()
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } }
    overviewError.value = axiosErr.response?.data?.message ?? 'Không thể tải dữ liệu dashboard.'
  } finally {
    overviewLoading.value = false
  }
}

async function loadCompanyAreas(force = false) {
  const key = companyAreaKey.value
  if (!force && companyAreasCache.value[key]) return

  const requestId = ++companyAreasRequestId
  companyAreasLoading.value = true
  companyAreasError.value = null
  try {
    const response = await dashboardService.getCompanyAreas(key)
    if (requestId !== companyAreasRequestId) return
    companyAreasCache.value = { ...companyAreasCache.value, [key]: response.areas }
  } catch (err: unknown) {
    if (requestId !== companyAreasRequestId) return
    const axiosErr = err as { response?: { data?: { message?: string } } }
    companyAreasError.value = axiosErr.response?.data?.message ?? 'Không tải được địa bàn doanh nghiệp.'
  } finally {
    if (requestId === companyAreasRequestId) {
      companyAreasLoading.value = false
    }
  }
}

async function loadCooperativeAreas(force = false) {
  const key = cooperativeAreaKey.value
  if (!force && cooperativeAreasCache.value[key]) return

  const requestId = ++cooperativeAreasRequestId
  cooperativeAreasLoading.value = true
  cooperativeAreasError.value = null
  try {
    const response = await dashboardService.getCooperativeAreas(key)
    if (requestId !== cooperativeAreasRequestId) return
    cooperativeAreasCache.value = { ...cooperativeAreasCache.value, [key]: response.areas }
  } catch (err: unknown) {
    if (requestId !== cooperativeAreasRequestId) return
    const axiosErr = err as { response?: { data?: { message?: string } } }
    cooperativeAreasError.value = axiosErr.response?.data?.message ?? 'Không tải được địa bàn hợp tác xã.'
  } finally {
    if (requestId === cooperativeAreasRequestId) {
      cooperativeAreasLoading.value = false
    }
  }
}

async function refreshAll() {
  companyAreasCache.value = {}
  cooperativeAreasCache.value = {}
  await loadOverview()
  await Promise.all([loadCompanyAreas(true), loadCooperativeAreas(true)])
}

watch(companyAreaKey, () => {
  companySearch.value = ''
  void loadCompanyAreas()
})

watch(cooperativeAreaKey, () => {
  cooperativeSearch.value = ''
  void loadCooperativeAreas()
})

onMounted(async () => {
  await loadOverview()
  void Promise.all([loadCompanyAreas(), loadCooperativeAreas()])
})
</script>
