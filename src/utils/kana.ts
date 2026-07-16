import type { KanaItem, KanaGroup } from '@/constants/kanaData'

export function getVowelIndex(romaji: string): number {
  const r = romaji.toLowerCase()
  if (r === 'n') return 4
  if (r.endsWith('a')) return 0
  if (r.endsWith('i') || r === 'ji') return 1
  if (r.endsWith('u') || r === 'tsu') return 2
  if (r.endsWith('e')) return 3
  if (r.endsWith('o') || r === 'wo') return 4
  return 0
}

export function groupKanaData(group: KanaGroup) {
  // 1. Group Gojuon
  const gojuonRows: Record<string, (KanaItem | null)[]> = {}
  group.gojuon.forEach(item => {
    if (!gojuonRows[item.rowGroup]) {
      gojuonRows[item.rowGroup] = Array(5).fill(null)
    }
    const idx = getVowelIndex(item.romaji)
    gojuonRows[item.rowGroup][idx] = item
  })

  // 2. Group Dakuten
  const dakutenRows: Record<string, (KanaItem | null)[]> = {}
  group.dakuten.forEach(item => {
    if (!dakutenRows[item.rowGroup]) {
      dakutenRows[item.rowGroup] = Array(5).fill(null)
    }
    const idx = getVowelIndex(item.romaji)
    dakutenRows[item.rowGroup][idx] = item
  })

  // 3. Group Yoon
  const yoonRows: Record<string, KanaItem[]> = {}
  group.yoon.forEach(item => {
    if (!yoonRows[item.rowGroup]) {
      yoonRows[item.rowGroup] = []
    }
    yoonRows[item.rowGroup].push(item)
  })

  // Return them in order of appearance in the original array (to preserve order)
  const getOrderedRows = (originalList: KanaItem[], groupedMap: Record<string, any[]>) => {
    const seen = new Set<string>()
    const ordered: { rowName: string; chars: any[] }[] = []
    originalList.forEach(item => {
      if (!seen.has(item.rowGroup)) {
        seen.add(item.rowGroup)
        ordered.push({
          rowName: item.rowGroup,
          chars: groupedMap[item.rowGroup]
        })
      }
    })
    return ordered
  }

  return {
    gojuon: getOrderedRows(group.gojuon, gojuonRows),
    dakuon: getOrderedRows(group.dakuten, dakutenRows), // Map to dakuon for template compatibility
    yoon: getOrderedRows(group.yoon, yoonRows)
  }
}
