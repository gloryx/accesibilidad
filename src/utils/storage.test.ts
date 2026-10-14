import { beforeEach, describe, expect, it } from 'vitest'
import { clearReports, loadReports, saveReport } from './storage'
import type { LabReport, VisualReport } from '../types'

const legacyReport: LabReport = {
  id: 'legacy', createdAt: '2026-10-14T00:00:00.000Z', studentName: 'Ana', mode: 'barriers', elapsedSeconds: 30, visitedControls: 4,
  evaluation: { focusVisible: 'No', allReachable: 'No', logicalOrder: 'No', completed: 'No', keyboardSubmit: 'No', foundBarriers: 'Sí', barriers: '', improvements: '', difficulty: 'Moderado' },
}

describe('report storage', () => {
  beforeEach(clearReports)

  it('migrates legacy reports to the keyboard challenge', () => {
    localStorage.setItem('accessibility-lab-reports', JSON.stringify([legacyReport]))
    expect(loadReports()[0].challenge).toBe('keyboard')
  })

  it('stores visual and keyboard reports together', () => {
    saveReport(legacyReport)
    const visual: VisualReport = {
      id: 'visual', challenge: 'visual', createdAt: '2026-10-14T01:00:00.000Z', studentName: 'Lucía', mode: 'accessible', elapsedSeconds: 45,
      activities: { deadline: { answer: '', status: '' }, contrast: { answer: '', status: '' }, statuses: { answer: '', status: '' }, error: { answer: '', status: '' }, smallText: { answer: '', status: '' } },
      evaluation: { readable: 'Sí', insufficientContrast: 'No', textSizeDifficult: 'No', colorOnly: 'No', problems: '', improvements: '' },
      conditionsUsed: { brightness: [0], glare: ['none'], textScale: [100] },
    }
    saveReport(visual)
    expect(loadReports().map((report) => report.challenge)).toEqual(['visual', 'keyboard'])
  })
})
