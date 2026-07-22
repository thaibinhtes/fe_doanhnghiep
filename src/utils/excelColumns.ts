/** Excel column letter(s) to 0-based index (A = 0, AA = 26). */
export function columnLetterToIndex(letter: string): number {
  const normalized = letter.trim().toUpperCase().replace(/[^A-Z]/g, '')
  if (!normalized) return -1

  let index = 0
  for (let i = 0; i < normalized.length; i++) {
    index = index * 26 + (normalized.charCodeAt(i) - 64)
  }

  return index - 1
}

/** 0-based index to Excel column letter. */
export function columnIndexToLetter(index: number): string {
  let columnIndex = index + 1
  let letter = ''
  while (columnIndex > 0) {
    columnIndex--
    letter = String.fromCharCode(65 + (columnIndex % 26)) + letter
    columnIndex = Math.floor(columnIndex / 26)
  }
  return letter
}

/** Parse "C", "D-G", "AA-AB", "AA,AC" into column letters. */
export function parseColumnInput(input: string): string[] {
  const normalized = input.trim().toUpperCase().replace(/\s+/g, '')
  if (!normalized) return []

  if (normalized.includes(',')) {
    return normalized
      .split(',')
      .flatMap((part) => parseColumnInput(part))
      .filter(Boolean)
  }

  const rangeMatch = normalized.match(/^([A-Z]+)-([A-Z]+)$/)
  if (rangeMatch) {
    const startIdx = columnLetterToIndex(rangeMatch[1])
    const endIdx = columnLetterToIndex(rangeMatch[2])
    if (startIdx < 0 || endIdx < 0) return [normalized]

    const from = Math.min(startIdx, endIdx)
    const to = Math.max(startIdx, endIdx)
    const cols: string[] = []
    for (let i = from; i <= to; i++) {
      cols.push(columnIndexToLetter(i))
    }
    return cols
  }

  const letter = normalized.replace(/[^A-Z]/g, '')
  return letter ? [letter] : []
}

export function columnsToDisplay(cols: string[]): string {
  if (cols.length === 0) return ''
  if (cols.length === 1) return cols[0]

  const indices = cols
    .map(columnLetterToIndex)
    .filter((idx) => idx >= 0)
    .sort((a, b) => a - b)

  if (indices.length === 0) return ''
  if (indices.length === 1) return columnIndexToLetter(indices[0])

  const isContiguous = indices.every((idx, i) => i === 0 || idx === indices[i - 1] + 1)

  if (isContiguous) {
    return `${columnIndexToLetter(indices[0])}-${columnIndexToLetter(indices[indices.length - 1])}`
  }

  return indices.map(columnIndexToLetter).join(',')
}
