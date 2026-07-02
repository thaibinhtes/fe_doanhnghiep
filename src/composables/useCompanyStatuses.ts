import { computed, ref } from 'vue'
import { statusService } from '@/services/statusService'
import type { CompanyStatus } from '@/types/status'

export function useCompanyStatuses() {
  const statuses = ref<CompanyStatus[]>([])
  const loading = ref(false)

  const loadStatuses = async () => {
    loading.value = true
    try {
      statuses.value = await statusService.getAll({ isActive: true })
    } finally {
      loading.value = false
    }
  }

  const defaultStatusId = computed(() => {
    return statuses.value.find((s) => s.macDinh)?.id ?? statuses.value.find((s) => s.ma === 'chua_dinh_danh')?.id ?? null
  })

  const identityStatuses = computed(() => statuses.value.filter((s) => s.loai === 'dinh_danh'))
  const otherStatuses = computed(() => statuses.value.filter((s) => s.loai === 'bao_cao' || s.loai === 'hoat_dong'))

  const requiresReason = (statusId: number | null | undefined) => {
    if (!statusId) return false
    return statuses.value.find((s) => s.id === statusId)?.yeuCauLyDo ?? false
  }

  return {
    statuses,
    loading,
    loadStatuses,
    defaultStatusId,
    identityStatuses,
    otherStatuses,
    requiresReason,
  }
}
