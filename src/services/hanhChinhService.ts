import api from './api'
import type {
  HanhChinhMappingItem,
  ImportCounts,
  LegacyDistrictItem,
  LegacyImportRow,
  LegacyProvinceItem,
  LegacyWardItem,
  PaginatedResponse,
  SyncResult,
} from '@/types/hanhChinh'

function unwrap<T>(payload: unknown): T {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: T }).data
  }
  return payload as T
}

function unwrapCollection<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[]
  if (payload && typeof payload === 'object' && Array.isArray((payload as { data?: unknown }).data)) {
    return (payload as { data: T[] }).data
  }
  return []
}

export const hanhChinhService = {
  async getLegacyProvinces(search = ''): Promise<LegacyProvinceItem[]> {
    const { data } = await api.get<{ data: unknown }>('/hanh-chinh/cu/tinh-thanh', {
      params: search ? { search } : undefined,
    })
    return unwrapCollection<LegacyProvinceItem>(data.data)
  },

  async getLegacyDistricts(provinceCode: string, search = ''): Promise<LegacyDistrictItem[]> {
    const { data } = await api.get<{ data: unknown }>(`/hanh-chinh/cu/tinh-thanh/${provinceCode}/quan-huyen`, {
      params: search ? { search } : undefined,
    })
    return unwrapCollection<LegacyDistrictItem>(data.data)
  },

  async getLegacyWards(districtCode: string, search = ''): Promise<LegacyWardItem[]> {
    const { data } = await api.get<{ data: unknown }>(`/hanh-chinh/cu/quan-huyen/${districtCode}/xa-phuong`, {
      params: search ? { search } : undefined,
    })
    return unwrapCollection<LegacyWardItem>(data.data)
  },

  async importLegacyWithMappings(items: LegacyImportRow[]): Promise<ImportCounts> {
    const { data } = await api.post<{ data: ImportCounts }>('/hanh-chinh/cu/import', { items })
    return unwrap<ImportCounts>(data)
  },

  async importNewFromDataset(provinceCodes?: string[]): Promise<ImportCounts> {
    const { data } = await api.post<{ data: ImportCounts }>('/hanh-chinh/moi/import-dataset', {
      provinceCodes,
    })
    return unwrap<ImportCounts>(data)
  },

  async getMappings(params: {
    page?: number
    perPage?: number
    search?: string
  } = {}): Promise<PaginatedResponse<HanhChinhMappingItem>> {
    const { data } = await api.get<{ data: PaginatedResponse<HanhChinhMappingItem> }>(
      '/hanh-chinh/mappings',
      { params },
    )
    return unwrap<PaginatedResponse<HanhChinhMappingItem>>(data)
  },

  async syncCompanies(dryRun = false): Promise<SyncResult> {
    const { data } = await api.post<{ data: SyncResult }>('/hanh-chinh/sync-doanh-nghiep', { dryRun })
    return unwrap<SyncResult>(data)
  },

  async getUnmappedCompanies(): Promise<{ count: number; items: SyncResult['unmapped'] }> {
    const { data } = await api.get<{ data: { count: number; items: SyncResult['unmapped'] } }>(
      '/hanh-chinh/unmapped-doanh-nghiep',
    )
    return unwrap(data)
  },
}
