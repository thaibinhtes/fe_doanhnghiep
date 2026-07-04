import type { IndustryCategory } from '@/types/industryCategory'

export interface IndustryFlatRow {
  id: number
  /** Mã chỉ tại cột cấp tương ứng (các cột khác null) */
  levels: (string | null)[]
  /** Khóa nhóm theo từng cấp để rowspan */
  pathKeys: (string | null)[]
  /** Id mục cấp 1 gốc (null nếu chính là cấp 1) */
  cap1Id: number | null
  ten: string
  cap: number
  isActive: boolean
  childrenCount: number
  item: IndustryCategory
  parentId: number | null
}

function sortNodes(nodes: IndustryCategory[]): IndustryCategory[] {
  return [...nodes].sort((a, b) => a.thuTu - b.thuTu || a.ma.localeCompare(b.ma))
}

function sortTree(nodes: IndustryCategory[]): IndustryCategory[] {
  return sortNodes(nodes).map((node) => ({
    ...node,
    children: node.children?.length ? sortTree(node.children) : [],
  }))
}

export function buildIndustryTree(items: IndustryCategory[]): IndustryCategory[] {
  const map = new Map<number, IndustryCategory>()

  for (const item of items) {
    map.set(item.id, { ...item, children: [] })
  }

  const roots: IndustryCategory[] = []

  for (const item of items) {
    const node = map.get(item.id)
    if (!node) continue

    if (item.parentId != null && map.has(item.parentId)) {
      map.get(item.parentId)!.children!.push(node)
    } else if (item.parentId == null) {
      roots.push(node)
    }
  }

  return sortTree(roots)
}

export function flattenIndustryTree(
  nodes: IndustryCategory[],
  ancestors: IndustryCategory[] = [],
): IndustryFlatRow[] {
  const rows: IndustryFlatRow[] = []

  for (const node of sortNodes(nodes)) {
    const chain = [...ancestors, node]
    const levels: (string | null)[] = [null, null, null, null, null]
    const pathKeys: (string | null)[] = [null, null, null, null, null]

    let path = ''
    chain.forEach((entry) => {
      path = path ? `${path}|${entry.ma}` : entry.ma
      pathKeys[entry.cap - 1] = path
    })

    levels[node.cap - 1] = node.ma

    const cap1Node = chain.find((entry) => entry.cap === 1)

    rows.push({
      id: node.id,
      levels,
      pathKeys,
      cap1Id: cap1Node && cap1Node.id !== node.id ? cap1Node.id : null,
      ten: node.ten,
      cap: node.cap,
      isActive: node.isActive,
      childrenCount: node.childrenCount ?? node.children?.length ?? 0,
      item: node,
      parentId: node.parentId ?? null,
    })

    if (node.children?.length) {
      rows.push(...flattenIndustryTree(node.children, chain))
    }
  }

  return rows
}

/** Ô mã chỉ render tại dòng định nghĩa cấp đó */
export function shouldRenderLevelCell(rows: IndustryFlatRow[], rowIdx: number, colIdx: number): boolean {
  return rows[rowIdx]?.cap === colIdx + 1
}

/** 0 = skip (merged), >=1 = rowspan */
export function getLevelRowSpan(rows: IndustryFlatRow[], rowIdx: number, colIdx: number): number {
  const row = rows[rowIdx]
  if (!row || row.cap !== colIdx + 1) return 0

  const key = row.pathKeys[colIdx]
  if (!key) return 1

  let span = 1
  for (let j = rowIdx + 1; j < rows.length; j++) {
    if (rows[j].pathKeys[colIdx] === key) {
      span++
    } else {
      break
    }
  }

  return span
}

export function filterIndustryRows(
  rows: IndustryFlatRow[],
  search: string,
  cap: string,
  isActive: string,
): IndustryFlatRow[] {
  const keyword = search.trim().toLowerCase()

  return rows.filter((row) => {
    if (cap && row.cap !== Number(cap)) return false
    if (isActive === 'true' && !row.isActive) return false
    if (isActive === 'false' && row.isActive) return false

    if (!keyword) return true

    const haystack = [row.item.ma, row.ten, ...(row.pathKeys.filter(Boolean) as string[])]
      .join(' ')
      .toLowerCase()

    return haystack.includes(keyword)
  })
}

export function applyCap1Collapse(
  rows: IndustryFlatRow[],
  collapsedCap1Ids: ReadonlySet<number>,
): IndustryFlatRow[] {
  if (collapsedCap1Ids.size === 0) return rows

  return rows.filter((row) => {
    if (row.cap === 1) return true
    const groupId = row.cap1Id ?? row.id
    return !collapsedCap1Ids.has(groupId)
  })
}
