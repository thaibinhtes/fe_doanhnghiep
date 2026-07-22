<template>
  <AdminLayout>
    <div class="space-y-5">
      <ComponentCard
        title="Import doanh nghiệp"
        desc="Upload file Excel từ đơn vị. Import chạy nền — bạn sẽ nhận thông báo khi hoàn tất."
      >
        <template #header-right>
          <router-link
            to="/companies/import-history"
            class="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M4.167 5.833h11.666M4.167 10h11.666M4.167 14.167H10"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
            Lịch sử import
          </router-link>
        </template>

        <div class="mb-5 flex flex-wrap gap-2 border-b border-gray-200 pb-3 dark:border-gray-700">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            type="button"
            class="rounded-lg px-4 py-2 text-sm font-medium transition"
            :class="
              activeTab === tab.key
                ? 'bg-brand-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
            "
            @click="switchTab(tab.key)"
          >
            {{ tab.label }}
          </button>
        </div>

        <div v-show="activeTab === 'import'">
          <CompanyImportPanel ref="importPanelRef" :show-header="false" />
        </div>

        <div v-show="activeTab === 'json'" class="space-y-4">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
                Cấu hình test API
              </h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                JSON phản ánh ánh xạ cột / startRow / valueExtensions đang chọn ở tab Import. Copy để gọi
                <code class="rounded bg-gray-100 px-1 text-xs dark:bg-gray-800">POST /api/doanh-nghiep/import</code>.
              </p>
            </div>
            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                class="inline-flex h-9 items-center justify-center rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                @click="refreshJson"
              >
                Làm mới
              </button>
              <button
                type="button"
                class="inline-flex h-9 items-center justify-center rounded-lg bg-brand-500 px-3 text-sm font-medium text-white transition hover:bg-brand-600"
                @click="copyJson"
              >
                {{ copied ? 'Đã copy' : 'Copy JSON' }}
              </button>
              <button
                type="button"
                class="inline-flex h-9 items-center justify-center rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                @click="copyCurl"
              >
                {{ copiedCurl ? 'Đã copy curl' : 'Copy curl' }}
              </button>
            </div>
          </div>

          <pre
            class="max-h-[min(70vh,640px)] overflow-auto rounded-xl border border-gray-200 bg-gray-950 p-4 text-xs leading-relaxed text-emerald-300 dark:border-gray-700"
          >{{ jsonText }}</pre>

          <div>
            <p class="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Ví dụ curl
            </p>
            <pre
              class="overflow-auto rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs leading-relaxed text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            >{{ curlText }}</pre>
          </div>
        </div>
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import CompanyImportPanel from '@/components/companies/CompanyImportPanel.vue'

const tabs = [
  { key: 'import', label: 'Import' },
  { key: 'json', label: 'JSON / API' },
] as const

type TabKey = (typeof tabs)[number]['key']

type ImportPanelExpose = {
  getApiTestPayload: () => {
    curl: string
    [key: string]: unknown
  }
}

const activeTab = ref<TabKey>('import')
const importPanelRef = ref<ImportPanelExpose | null>(null)
const payload = ref<Record<string, unknown> | null>(null)
const copied = ref(false)
const copiedCurl = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | null = null
let curlTimer: ReturnType<typeof setTimeout> | null = null

const jsonText = computed(() => {
  if (!payload.value) {
    return '{\n  "message": "Chưa có cấu hình. Mở tab Import rồi quay lại, hoặc bấm Làm mới."\n}'
  }
  const { curl: _curl, ...rest } = payload.value as { curl?: string }
  return JSON.stringify(rest, null, 2)
})

const curlText = computed(() => {
  const curl = payload.value?.curl
  return typeof curl === 'string' ? curl : '# Chưa có curl'
})

function refreshJson() {
  const next = importPanelRef.value?.getApiTestPayload?.()
  payload.value = next ?? null
}

async function switchTab(tab: TabKey) {
  activeTab.value = tab
  if (tab === 'json') {
    await nextTick()
    refreshJson()
  }
}

async function copyText(text: string, kind: 'json' | 'curl') {
  try {
    await navigator.clipboard.writeText(text)
    if (kind === 'json') {
      copied.value = true
      if (copyTimer) clearTimeout(copyTimer)
      copyTimer = setTimeout(() => {
        copied.value = false
      }, 1600)
    } else {
      copiedCurl.value = true
      if (curlTimer) clearTimeout(curlTimer)
      curlTimer = setTimeout(() => {
        copiedCurl.value = false
      }, 1600)
    }
  } catch {
    // ignore clipboard errors
  }
}

function copyJson() {
  refreshJson()
  void copyText(jsonText.value, 'json')
}

function copyCurl() {
  refreshJson()
  void copyText(curlText.value, 'curl')
}
</script>
