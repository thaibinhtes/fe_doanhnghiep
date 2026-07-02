import api from './api'

export interface CompanyImportDocs {
  companyImportTemplateUrl: string
  companyIdentityImportTemplateUrl: string
}

export const settingService = {
  async getCompanyImportDocs(): Promise<CompanyImportDocs> {
    const { data } = await api.get<{ data: CompanyImportDocs }>('/settings/company-import-docs')
    return data.data
  },
}
