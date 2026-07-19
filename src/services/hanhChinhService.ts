import api from './api'
import type {
  HanhChinhImportConfig,
  HanhChinhImportExampleConfig,
  HanhChinhImportFormat,
  HanhChinhImportColumnMap,
  HanhChinhMappingItem,
  HanhChinhMappingGroup,
  LinkMappingPayload,
  LinkMappingResult,
  HanhChinhNewImportConfig,
  ImportCounts,
  LegacyDistrictItem,
  LegacyWardItem,
  LegacyImportRow,
  LegacyProvinceItem,
  NewDataClearPreview,
  NewDataClearResult,
  NewWardItem,
  PaginatedResponse,
  SyncResult,
  CompanyFieldSyncOption,
  CompanyFieldSyncResult,
  CompanyAdministrativeCatalogSyncResult,
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

function unwrapPaginator<T>(payload: {
  data?: T[]
  meta?: PaginatedResponse<T>['meta']
}): PaginatedResponse<T> {
  return {
    data: Array.isArray(payload.data) ? payload.data : [],
    meta: payload.meta,
  }
}

export const hanhChinhService = {
  async getLegacyProvinces(search = ''): Promise<LegacyProvinceItem[]> {
    const { data } = await api.get<{ data: unknown }>('/hanh-chinh/cu/tinh-thanh', {
      params: search ? { search } : undefined,
    })
    return unwrapCollection<LegacyProvinceItem>(data.data)
  },

  async getLegacyUnits(params: {
    page?: number
    perPage?: number
    search?: string
    unmappedOnly?: boolean
  } = {}): Promise<PaginatedResponse<LegacyWardItem>> {
    const { data } = await api.get<{
      data: LegacyWardItem[]
      meta?: PaginatedResponse<LegacyWardItem>['meta']
    }>(
      '/hanh-chinh/cu/don-vi',
      { params },
    )
    return unwrapPaginator<LegacyWardItem>(data)
  },

  async getLegacyDistricts(search = ''): Promise<LegacyDistrictItem[]> {
    const { data } = await api.get<{ data: unknown }>('/hanh-chinh/cu/quan-huyen', {
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

  async importLegacyFromExcel(file: File, config?: { startRow?: number; columnMap?: HanhChinhImportColumnMap }): Promise<ImportCounts> {
    const formData = new FormData()
    formData.append('file', file)
    if (config?.startRow !== undefined) formData.append('startRow', String(config.startRow))
    if (config?.columnMap) formData.append('columnMap', JSON.stringify(config.columnMap))

    const { data } = await api.post<{ data: ImportCounts }>('/hanh-chinh/cu/import-excel', formData, {
      timeout: 600_000,
    })
    return unwrap<ImportCounts>(data)
  },

  async getImportColumnMap(): Promise<HanhChinhImportConfig> {
    const { data } = await api.get<{ data: HanhChinhImportConfig }>('/hanh-chinh/cu/import-column-map')
    return data.data
  },

  async getImportConfigs(): Promise<HanhChinhImportExampleConfig[]> {
    const { data } = await api.get<{ data: HanhChinhImportExampleConfig[] }>('/hanh-chinh/cu/import-configs')
    return data.data
  },

  async getImportFormats(): Promise<HanhChinhImportFormat[]> {
    const { data } = await api.get<{ data: HanhChinhImportFormat[] }>('/hanh-chinh/cu/import-formats')
    return data.data
  },

  async saveImportFormat(payload: {
    name: string
    startRow: number
    columnMap: HanhChinhImportColumnMap
    valueExtensions?: Record<string, string>
  }): Promise<HanhChinhImportFormat> {
    const { data } = await api.post<{ data: HanhChinhImportFormat }>('/hanh-chinh/cu/import-formats', payload)
    return data.data
  },

  async deleteImportFormat(id: number): Promise<void> {
    await api.delete(`/hanh-chinh/cu/import-formats/${id}`)
  },

  async importNewFromDataset(provinceCodes?: string[]): Promise<ImportCounts> {
    const { data } = await api.post<{ data: ImportCounts }>('/hanh-chinh/moi/import-dataset', {
      provinceCodes,
    })
    return unwrap<ImportCounts>(data)
  },

  async getNewUnits(params: {
    page?: number
    perPage?: number
    search?: string
  } = {}): Promise<PaginatedResponse<NewWardItem>> {
    const { data } = await api.get<{
      data: NewWardItem[]
      meta?: PaginatedResponse<NewWardItem>['meta']
    }>(
      '/hanh-chinh/moi/don-vi',
      { params },
    )
    return unwrapPaginator<NewWardItem>(data)
  },

  async getNewImportColumnMap(): Promise<HanhChinhNewImportConfig> {
    const { data } = await api.get<{ data: HanhChinhNewImportConfig }>('/hanh-chinh/moi/import-column-map')
    return data.data
  },

  async importNewFromExcel(file: File, config?: { startRow?: number; columnMap?: HanhChinhImportColumnMap }): Promise<ImportCounts> {
    const formData = new FormData()
    formData.append('file', file)
    if (config?.startRow !== undefined) formData.append('startRow', String(config.startRow))
    if (config?.columnMap) formData.append('columnMap', JSON.stringify(config.columnMap))

    const { data } = await api.post<{ data: ImportCounts }>('/hanh-chinh/moi/import-excel', formData, {
      timeout: 600_000,
    })
    return unwrap<ImportCounts>(data)
  },

  async getNewClearPreview(): Promise<NewDataClearPreview> {
    const { data } = await api.get<{ data: NewDataClearPreview }>('/hanh-chinh/moi/clear/preview')
    return data.data
  },

  async clearNewData(): Promise<NewDataClearResult> {
    const { data } = await api.delete<{ data: NewDataClearResult }>('/hanh-chinh/moi/clear')
    return data.data
  },

  async getMappings(params: {
    page?: number
    perPage?: number
    search?: string
  } = {}): Promise<PaginatedResponse<HanhChinhMappingItem>> {
    const { data } = await api.get<{
      data: HanhChinhMappingItem[]
      meta?: PaginatedResponse<HanhChinhMappingItem>['meta']
    }>(
      '/hanh-chinh/mappings',
      { params },
    )
    return unwrapPaginator<HanhChinhMappingItem>(data)
  },

  async getMappingGroups(search = ''): Promise<HanhChinhMappingGroup[]> {
    const { data } = await api.get<{ data: HanhChinhMappingGroup[] }>('/hanh-chinh/mappings/groups', {
      params: search ? { search } : undefined,
    })
    return unwrapCollection<HanhChinhMappingGroup>(data.data)
  },

  async linkMappings(payload: LinkMappingPayload): Promise<LinkMappingResult> {
    const { data } = await api.post<{ data: LinkMappingResult }>('/hanh-chinh/mappings/link', payload)
    return unwrap<LinkMappingResult>(data)
  },

  async deleteMapping(id: number): Promise<void> {
    await api.delete(`/hanh-chinh/mappings/${id}`)
  },

  async importMappingsFromExcel(
    file: File,
    config?: { startRow?: number; columnMap?: HanhChinhImportColumnMap; mode?: 'full' | 'mapping-only' },
  ): Promise<ImportCounts> {
    const formData = new FormData()
    formData.append('file', file)
    if (config?.startRow !== undefined) formData.append('startRow', String(config.startRow))
    if (config?.columnMap) formData.append('columnMap', JSON.stringify(config.columnMap))
    if (config?.mode) formData.append('mode', config.mode)

    const { data } = await api.post<{ data: ImportCounts }>('/hanh-chinh/mappings/import-excel', formData, {
      timeout: 600_000,
    })
    return unwrap<ImportCounts>(data)
  },

  async syncCompanies(dryRun = false): Promise<SyncResult> {
    const { data } = await api.post<{ data: SyncResult }>('/hanh-chinh/sync-doanh-nghiep', { dryRun })
    return unwrap<SyncResult>(data)
  },

  async syncCompanyTextCatalogs(dryRun = false): Promise<CompanyAdministrativeCatalogSyncResult> {
    const { data } = await api.post<{ data: CompanyAdministrativeCatalogSyncResult }>(
      '/hanh-chinh/sync-doanh-nghiep-text-catalogs',
      { dryRun },
    )
    return unwrap<CompanyAdministrativeCatalogSyncResult>(data)
  },

  async getCompanyFieldSyncOptions(): Promise<CompanyFieldSyncOption[]> {
    const { data } = await api.get<{ data: CompanyFieldSyncOption[] }>('/hanh-chinh/sync-doanh-nghiep/fields')
    return unwrap<CompanyFieldSyncOption[]>(data)
  },

  async syncCompanyField(payload: {
    field: 'quanHuyen' | 'phuongXa'
    sourceTable: 'hanh_chinh_cu' | 'hanh_chinh_moi'
    dryRun?: boolean
  }): Promise<CompanyFieldSyncResult> {
    const { data } = await api.post<{ data: CompanyFieldSyncResult }>('/hanh-chinh/sync-doanh-nghiep-field', payload)
    return unwrap<CompanyFieldSyncResult>(data)
  },

  async getUnmappedCompanies(): Promise<{ count: number; items: SyncResult['unmapped'] }> {
    const { data } = await api.get<{ data: { count: number; items: SyncResult['unmapped'] } }>(
      '/hanh-chinh/unmapped-doanh-nghiep',
    )
    return unwrap(data)
  },
}
