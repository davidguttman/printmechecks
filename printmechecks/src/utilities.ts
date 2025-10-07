import type { CheckData } from './types/check'

const CHECK_HISTORY_KEY = 'checkList'
const BATCH_TEMPLATE_KEY = 'batchTemplate'

function readHistory(): CheckData[] {
  if (typeof localStorage === 'undefined') {
    return []
  }

  try {
    const raw = localStorage.getItem(CHECK_HISTORY_KEY)
    return raw ? (JSON.parse(raw) as CheckData[]) : []
  } catch (error) {
    console.warn('Failed to read check history from localStorage', error)
    return []
  }
}

function getRecentCheck(): CheckData | null {
  const history = readHistory()
  if (history.length === 0) {
    return null
  }
  return history[history.length - 1]
}

function readBatchTemplate(): CheckData | null {
  if (typeof localStorage === 'undefined') {
    return null
  }

  try {
    const raw = localStorage.getItem(BATCH_TEMPLATE_KEY)
    return raw ? (JSON.parse(raw) as CheckData) : null
  } catch (error) {
    console.warn('Failed to read batch template from localStorage', error)
    return null
  }
}

export function cloneCheck(check: CheckData): CheckData {
  return JSON.parse(JSON.stringify(check)) as CheckData
}

export function createDefaultCheck(): CheckData {
  const recent = getRecentCheck()
  const nextCheckNumber = (() => {
    if (!recent || !recent.checkNumber) {
      return '100'
    }

    const parsed = Number.parseInt(recent.checkNumber, 10)
    if (Number.isNaN(parsed)) {
      return recent.checkNumber
    }

    return String(parsed + 1)
  })()

  return {
    accountHolderName: recent?.accountHolderName || 'John Smith',
    accountHolderAddress: recent?.accountHolderAddress || '123 Cherry Tree Lane',
    accountHolderCity: recent?.accountHolderCity || 'New York',
    accountHolderState: recent?.accountHolderState || 'NY',
    accountHolderZip: recent?.accountHolderZip || '10001',
    checkNumber: nextCheckNumber,
    date: new Date().toLocaleDateString(),
    bankName: recent?.bankName || 'Bank Name, INC',
    amount: recent?.amount || '100.00',
    payTo: recent?.payTo || 'Michael Johnson',
    memo: recent?.memo || 'Rent',
    signature: recent?.signature || 'John Smith',
    signatureSvg: recent?.signatureSvg || null,
    routingNumber: recent?.routingNumber || '022303659',
    bankAccountNumber: recent?.bankAccountNumber || '000000000000'
  }
}

export function formatMoney(value: string): string {
  const parsed = Number.parseFloat(value)
  if (Number.isNaN(parsed)) {
    return '0.00'
  }

  return parsed.toLocaleString('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

export function parseDateString(value: string): Date | null {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return null
  }
  return parsed
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  })
}

export function saveHistory(checks: CheckData[]): void {
  if (typeof localStorage === 'undefined') {
    return
  }
  localStorage.setItem(CHECK_HISTORY_KEY, JSON.stringify(checks))
}

export function appendToHistory(check: CheckData): void {
  const checks = readHistory()
  checks.push(cloneCheck(check))
  saveHistory(checks)
}

export function getHistory(): CheckData[] {
  return readHistory()
}

export function loadBatchTemplate(): CheckData | null {
  const stored = readBatchTemplate()
  return stored ? cloneCheck(stored) : null
}

export function saveBatchTemplate(template: CheckData): void {
  if (typeof localStorage === 'undefined') {
    return
  }
  localStorage.setItem(BATCH_TEMPLATE_KEY, JSON.stringify(cloneCheck(template)))
}
