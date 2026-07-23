import api from './api'
import type {
  TaxCompanyItem,
  TaxCompanyPaymentHistoryItem,
  TaxImportColumnMap,
  TaxImportConfig,
  TaxImportDispatchResult,
  TaxImportJobHistoryItem,
  TaxImportJobRow,
  TaxImportResult,
  TaxCooperativeItem,
  TaxPaginatedResponse,
  TaxUnit,
  TaxUnitImportPreviewResult,
} from '@/types/taxManagement'

export const taxManagementService = {
  async getTaxUnits(params: { page?: number; perPage?: number; search?: string } = {}) {
    const { data } = await api.get<{
      data?: TaxPaginatedResponse<TaxUnit> | TaxUnit[]
      meta?: TaxPaginatedResponse<TaxUnit>['meta']
    }>('/tax-units', { params })

    // Supports both ApiController::success({data,meta}) and paginated resource ({data,meta})
    if (Array.isArray(data.data)) {
      return { data: data.data, meta: data.meta }
    }

    if (data.data && typeof data.data === 'object' && Array.isArray((data.data as TaxPaginatedResponse<TaxUnit>).data)) {
      return data.data as TaxPaginatedResponse<TaxUnit>
    }

    return { data: [], meta: data.meta }
  },

  async createTaxUnit(payload: { unitCode: string; unitName: string }) {
    const { data } = await api.post<{ data: TaxUnit }>('/tax-units', payload)
    return data.data
  },

  async updateTaxUnit(id: number, payload: { unitCode: string; unitName: string }) {
    const { data } = await api.put<{ data: TaxUnit }>(`/tax-units/${id}`, payload)
    return data.data
  },

  async deleteTaxUnit(id: number) {
    await api.delete(`/tax-units/${id}`)
  },

  async getCompanyTaxList(params: { page?: number; perPage?: number; search?: string } = {}) {
    const { data } = await api.get<{ data: TaxPaginatedResponse<TaxCompanyItem> }>('/tax-management/companies', { params })
    return data.data
  },

  async getCooperativeTaxList(params: { page?: number; perPage?: number; search?: string } = {}) {
    const { data } = await api.get<{ data: TaxPaginatedResponse<TaxCooperativeItem> }>('/tax-management/cooperatives', { params })
    return data.data
  },

  async getCompanyTaxPaymentHistory(doanhNghiepId: number, params: { page?: number; perPage?: number } = {}) {
    const { data } = await api.get<{ data: TaxPaginatedResponse<TaxCompanyPaymentHistoryItem> }>(
      `/tax-management/companies/${doanhNghiepId}/payment-history`,
      { params },
    )
    return data.data
  },

  async getCompaniesByTaxUnit(
    taxUnitId: number,
    params: { page?: number; perPage?: number; paidFrom?: string; paidTo?: string } = {},
  ) {
    const { data } = await api.get<{ data: TaxPaginatedResponse<TaxCompanyItem> }>(
      `/tax-management/tax-units/${taxUnitId}/companies`,
      { params },
    )
    return data.data
  },

  async updateCompanyTaxUnit(payload: { doanhNghiepId: number; taxUnitId?: number | null; taxPaidAt?: string | null }) {
    await api.post('/tax-management/companies', payload)
  },

  async updateCooperativeTaxUnit(payload: { hopTacXaId: number; taxUnitId?: number | null }) {
    await api.post('/tax-management/cooperatives', payload)
  },

  async getTaxUnitImportColumnMap(): Promise<TaxImportConfig> {
    const { data } = await api.get<{ data: TaxImportConfig }>('/tax-units/import-column-map')
    return data.data
  },

  async previewTaxUnitsFromExcel(
    file: File,
    config?: { startRow?: number; columnMap?: TaxImportColumnMap; limit?: number },
  ): Promise<TaxUnitImportPreviewResult> {
    const formData = new FormData()
    formData.append('file', file)
    if (config?.startRow !== undefined) formData.append('startRow', String(config.startRow))
    if (config?.columnMap) formData.append('columnMap', JSON.stringify(config.columnMap))
    if (config?.limit !== undefined) formData.append('limit', String(config.limit))

    const { data } = await api.post<{ data: TaxUnitImportPreviewResult }>('/tax-units/import-preview', formData, {
      timeout: 120_000,
    })
    return data.data
  },

  async importTaxUnitsFromExcel(
    file: File,
    config?: { startRow?: number; columnMap?: TaxImportColumnMap },
  ): Promise<TaxImportDispatchResult> {
    const formData = new FormData()
    formData.append('file', file)
    if (config?.startRow !== undefined) formData.append('startRow', String(config.startRow))
    if (config?.columnMap) formData.append('columnMap', JSON.stringify(config.columnMap))

    const { data } = await api.post<{ data: TaxImportDispatchResult }>('/tax-units/import-excel', formData, {
      timeout: 600_000,
    })
    return data.data
  },

  async getCompanyTaxImportColumnMap(): Promise<TaxImportConfig> {
    const { data } = await api.get<{ data: TaxImportConfig }>('/tax-management/companies/import-column-map')
    return data.data
  },

  async importCompanyTaxFromExcel(
    file: File,
    config?: { startRow?: number; columnMap?: TaxImportColumnMap; taxPaidAt?: string },
  ): Promise<TaxImportDispatchResult> {
    const formData = new FormData()
    formData.append('file', file)
    if (config?.startRow !== undefined) formData.append('startRow', String(config.startRow))
    if (config?.columnMap) formData.append('columnMap', JSON.stringify(config.columnMap))
    if (config?.taxPaidAt) formData.append('taxPaidAt', config.taxPaidAt)

    const { data } = await api.post<{ data: TaxImportDispatchResult }>('/tax-management/companies/import-excel', formData, {
      timeout: 600_000,
    })
    return data.data
  },

  async getCooperativeTaxImportColumnMap(): Promise<TaxImportConfig> {
    const { data } = await api.get<{ data: TaxImportConfig }>('/tax-management/cooperatives/import-column-map')
    return data.data
  },

  async importCooperativeTaxFromExcel(
    file: File,
    config?: { startRow?: number; columnMap?: TaxImportColumnMap; taxPaidAt?: string },
  ): Promise<TaxImportDispatchResult> {
    const formData = new FormData()
    formData.append('file', file)
    if (config?.startRow !== undefined) formData.append('startRow', String(config.startRow))
    if (config?.columnMap) formData.append('columnMap', JSON.stringify(config.columnMap))
    if (config?.taxPaidAt) formData.append('taxPaidAt', config.taxPaidAt)

    const { data } = await api.post<{ data: TaxImportDispatchResult }>('/tax-management/cooperatives/import-excel', formData, {
      timeout: 600_000,
    })
    return data.data
  },

  async getImportJobs(params: { type?: 'tax_units' | 'company_tax' | 'cooperative_tax'; page?: number; perPage?: number } = {}) {
    const { data } = await api.get<{ data: TaxPaginatedResponse<TaxImportJobHistoryItem> }>('/tax-management/import-jobs', { params })
    return data.data
  },

  async getImportJobRows(
    importJobId: number,
    params: { page?: number; perPage?: number; status?: 'success' | 'duplicate' | 'failed' } = {},
  ) {
    const { data } = await api.get<{ data: TaxPaginatedResponse<TaxImportJobRow> }>(
      `/tax-management/import-jobs/${importJobId}/rows`,
      { params },
    )
    return data.data
  },
}
