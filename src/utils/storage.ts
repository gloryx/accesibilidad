import type { StoredReport } from '../types'

const STORAGE_KEY = 'accessibility-lab-reports'

export function loadReports(): StoredReport[] {
  try {
    const reports = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as StoredReport[]
    return reports.map((report) => report.challenge ? report : { ...report, challenge: 'keyboard' as const })
  } catch {
    return []
  }
}

export function saveReport(report: StoredReport) {
  const reports = [report, ...loadReports()].slice(0, 10)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports))
}

export function clearReports() {
  localStorage.removeItem(STORAGE_KEY)
}
