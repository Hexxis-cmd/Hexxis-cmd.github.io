import { useMemo } from 'react'

const atMidnight = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())
const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

function nthWeekday(year, month, weekday, occurrence) {
  const first = new Date(year, month, 1)
  const day = 1 + ((7 + weekday - first.getDay()) % 7) + (occurrence - 1) * 7
  return new Date(year, month, day)
}

function lastWeekday(year, month, weekday) {
  const last = new Date(year, month + 1, 0)
  return new Date(year, month, last.getDate() - ((7 + last.getDay() - weekday) % 7))
}

function easter(year) {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(year, month, day)
}

function isHanukkah(date) {
  try {
    const formatter = new Intl.DateTimeFormat('en-u-ca-hebrew', { month: 'long', day: 'numeric' })
    const year = date.getFullYear()
    for (let offset = -1; offset <= 0; offset += 1) {
      for (let cursor = new Date(year + offset, 10, 15); cursor <= new Date(year + offset, 11, 31); cursor.setDate(cursor.getDate() + 1)) {
        const parts = Object.fromEntries(formatter.formatToParts(cursor).map(({ type, value }) => [type, value]))
        if (parts.month === 'Kislev' && Number(parts.day) === 25) {
          const days = (atMidnight(date) - atMidnight(cursor)) / 86400000
          if (days >= 0 && days < 8) return true
        }
      }
    }
  } catch {
    return false
  }
  return false
}

function getTheme(date) {
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  const fixed = (targetMonth, targetDay) => month === targetMonth && day === targetDay
  const holiday = (id, label, accessory, effect = '') => ({ id, label, accessory, effect })

  if (fixed(11, 31) || fixed(0, 1)) return holiday('new-year', "New Year's", 0, 'confetti')
  if (fixed(1, 14)) return holiday('valentine', "Valentine's Day", 1)
  if (fixed(2, 17)) return holiday('st-patrick', "St. Patrick's Day", 2)
  if (sameDay(date, easter(year))) return holiday('easter', 'Easter', 3, 'egg')
  if (sameDay(date, nthWeekday(year, 4, 0, 2))) return holiday('mothers-day', "Mother's Day", 4)
  if (sameDay(date, lastWeekday(year, 4, 1))) return holiday('memorial-day', 'Memorial Day', 5)
  if (sameDay(date, nthWeekday(year, 5, 0, 3))) return holiday('fathers-day', "Father's Day", 6)
  if (fixed(5, 19)) return holiday('juneteenth', 'Juneteenth', 7)
  if (fixed(6, 4)) return holiday('independence-day', 'Independence Day', 8, 'fireworks')
  if (sameDay(date, nthWeekday(year, 8, 1, 1))) return holiday('labor-day', 'Labor Day', 9)
  if (fixed(9, 31)) return holiday('halloween', 'Halloween', 10, 'bats')
  if (fixed(10, 11)) return holiday('veterans-day', 'Veterans Day', 12)
  if (sameDay(date, nthWeekday(year, 10, 4, 4))) return holiday('thanksgiving', 'Thanksgiving', 13)
  if (isHanukkah(date)) return holiday('hanukkah', 'Hanukkah', 14, 'dreidel')
  if (month === 11 && day >= 26) return holiday('kwanzaa', 'Christmas + Kwanzaa', 15, 'candles')
  if (month === 11) return holiday('christmas', 'Christmas', 15)

  if (month <= 1) return holiday('winter', 'Winter mode', -1)
  if (month <= 4) return holiday('spring', 'Spring mode', -1)
  if (month <= 6) return holiday('summer', 'Summer mode', -1)
  return holiday('fall', 'Fall mode', -1)
}

export function useHolidayTheme() {
  const previewDate = import.meta.env.DEV ? new URLSearchParams(window.location.search).get('date') : null
  return useMemo(() => getTheme(previewDate ? new Date(`${previewDate}T12:00:00`) : new Date()), [previewDate])
}
