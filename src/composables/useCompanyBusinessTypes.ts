import { computed, ref } from 'vue'
import { businessTypeService } from '@/services/businessTypeService'
import type { CompanyBusinessType } from '@/types/businessType'

export function useCompanyBusinessTypes() {
  const businessTypes = ref<CompanyBusinessType[]>([])
  const loading = ref(false)

  const loadBusinessTypes = async () => {
    loading.value = true
    try {
      businessTypes.value = await businessTypeService.getAll({ isActive: true })
    } finally {
      loading.value = false
    }
  }

  const defaultTypeId = computed(() => {
    return businessTypes.value.find((item) => item.macDinh)?.id ?? businessTypes.value[0]?.id ?? null
  })

  const labelById = (id: number | null | undefined) => {
    if (!id) return ''
    return businessTypes.value.find((item) => item.id === id)?.ten ?? ''
  }

  return {
    businessTypes,
    loading,
    loadBusinessTypes,
    defaultTypeId,
    labelById,
  }
}
