/**
 * Memformat objek Date atau waktu saat ini menjadi teks tanggal & waktu dalam Bahasa Indonesia (WIB / UTC+7)
 * Contoh output: " 14 September 2026 pukul 14.41.00 WIB\
 */
export function formatIndonesianDateTime(date: Date = new Date()): string {
  try {
    const formatter = new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Asia/Jakarta',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    return `${formatter.format(date)} WIB`
  } catch {
    return `${date.toISOString()} (UTC)`
  }
}
