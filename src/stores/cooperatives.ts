import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cooperativeService } from '@/services/cooperativeService'
import type { Cooperative, CooperativeFilters, CooperativeListMeta } from '@/types/cooperative'

export const useCooperativesStore = defineStore('cooperatives', () => {
  const cooperatives = ref<Cooperative[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const meta = ref<CooperativeListMeta>({
    current_page: 1,
    from: 1,
    last_page: 1,
    links: [],
    path: '',
    per_page: 50,
    to: 1,
    total: 0,
  })

  const page = computed(() => meta.value.current_page)
  const perPage = computed(() => meta.value.per_page)
  const total = computed(() => meta.value.total)
  const totalPages = computed(() => meta.value.last_page)

  async function fetchCooperatives(filters?: CooperativeFilters) {
    loading.value = true
    error.value = null
    try {
      const response = await cooperativeService.getAll(filters)
      cooperatives.value = response.data.map((item) => ({
        ...item,
        tt: item.tt ?? item.id,
        tenHtx: item.tenHtx || '',
        maSoThue: item.maSoThue || '',
        diaChi: item.diaChi || '-',
        phuongXa: item.phuongXa || '-',
        vonDieuLe: item.vonDieuLe || '-',
        dienThoai: item.dienThoai || '-',
        chuTichHdqtTen: item.chuTichHdqtTen || '-',
        linhVuc: item.linhVuc || '-',
        hoatDong: item.hoatDong || '-',
        donViTen: item.donViTen || item.donVi?.ten || '-',
      }))
      meta.value = response.meta
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      error.value = axiosErr.response?.data?.message || 'Không thể tải danh sách hợp tác xã'
    } finally {
      loading.value = false
    }
  }

  async function deleteCooperative(id: number) {
    loading.value = true
    error.value = null
    try {
      await cooperativeService.delete(id)
      cooperatives.value = cooperatives.value.filter((item) => item.id !== id)
      meta.value.total -= 1
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      error.value = axiosErr.response?.data?.message || 'Không thể xóa hợp tác xã'
      throw err
    } finally {
      loading.value = false
    }
  }

  function setPage(newPage: number) {
    meta.value.current_page = newPage
  }

  function setPerPage(size: number) {
    meta.value.per_page = size
    meta.value.current_page = 1
  }

  return {
    cooperatives,
    loading,
    error,
    meta,
    page,
    perPage,
    total,
    totalPages,
    fetchCooperatives,
    deleteCooperative,
    setPage,
    setPerPage,
  }
})
