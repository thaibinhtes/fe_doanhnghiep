/**
 * Format a number or numeric string as compact Vietnamese Dong (VND)
 * Examples:
 *   formatVND(10000000000)     // "10 tỷ VNĐ"
 *   formatVND('5000000')       // "5 triệu VNĐ"
 *   formatVND('150000000')     // "150 triệu VNĐ"
 *   formatVND('1200000000')    // "1,2 tỷ VNĐ"
 *   formatVND(500000)          // "500.000 VNĐ"
 *   formatVND(null)            // "-"
 *   formatVND(0)               // "0 VNĐ"
 */
export function formatVND(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '-'

  const clean = typeof value === 'string' ? value.replace(/[^\d]/g, '') : String(value)
  const num = Number(clean)

  if (Number.isNaN(num)) return '-'
  if (num === 0) return '0 VNĐ'

  const tỷ = 1_000_000_000
  const triệu = 1_000_000
  const nghìn = 1_000

  if (num >= tỷ) {
    const tỷValue = num / tỷ
    // If it's a whole number, show as integer
    if (Number.isInteger(tỷValue)) {
      return `${tỷValue.toLocaleString('vi-VN')} tỷ VNĐ`
    }
    // Otherwise show with 1 decimal if the decimal part is significant
    const formatted = tỷValue.toLocaleString('vi-VN', { maximumFractionDigits: 1 })
    return `${formatted} tỷ VNĐ`
  }

  if (num >= triệu) {
    const triệuValue = num / triệu
    if (Number.isInteger(triệuValue)) {
      return `${triệuValue.toLocaleString('vi-VN')} triệu VNĐ`
    }
    const formatted = triệuValue.toLocaleString('vi-VN', { maximumFractionDigits: 1 })
    return `${formatted} triệu VNĐ`
  }

  if (num >= nghìn) {
    return `${num.toLocaleString('vi-VN')} VNĐ`
  }

  return `${num.toLocaleString('vi-VN')} VNĐ`
}

/**
 * Parse a VND formatted string back to a plain number string
 * Examples:
 *   parseVND('10.000.000.000 VNĐ')  // "10000000000"
 *   parseVND('5.000.000')           // "5000000"
 */
export function parseVND(value: string): string {
  return value.replace(/[^\d]/g, '')
}

/**
 * Format a number with Vietnamese locale separators
 * Examples:
 *   formatNumber(1234567)   // "1.234.567"
 */
export function formatNumber(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '-'

  const num = typeof value === 'string' ? Number(value.replace(/[^\d.-]/g, '')) : Number(value)

  if (Number.isNaN(num)) return '-'

  return num.toLocaleString('vi-VN')
}
