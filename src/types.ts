export type Mode = 'barriers' | 'accessible'
export type Stage = 'home' | 'setup' | 'challenge' | 'evaluation' | 'report'
export type AppView = Stage | 'visual-setup' | 'visual-challenge' | 'visual-evaluation' | 'visual-report' | 'results'
export type YesNo = 'Sí' | 'No'
export type FocusVisibility = YesNo | 'Parcialmente'
export type Difficulty = 'Fácil' | 'Moderado' | 'Difícil'
export type BrightnessLevel = 0 | 1 | 2 | 3
export type GlareLevel = 'none' | 'moderate' | 'intense'
export type TextScale = 75 | 100 | 150 | 200
export type ActivityStatus = 'completed' | 'unable' | ''
export type VisualActivityId = 'deadline' | 'contrast' | 'statuses' | 'error' | 'smallText'

export interface ChallengeData {
  fullName: string
  email: string
  identification: string
  career: string
  modality: string
  interests: string[]
  participationDate: string
  comments: string
  accepted: boolean
}

export interface EvaluationData {
  focusVisible: FocusVisibility
  allReachable: YesNo
  logicalOrder: YesNo
  completed: YesNo
  keyboardSubmit: YesNo
  foundBarriers: YesNo
  barriers: string
  improvements: string
  difficulty: Difficulty
}

export interface LabReport {
  id: string
  challenge?: 'keyboard'
  createdAt: string
  studentName: string
  mode: Mode
  elapsedSeconds: number
  visitedControls: number
  evaluation: EvaluationData
}

export interface VisualActivityResponse {
  answer: string
  status: ActivityStatus
}

export type VisualActivityResponses = Record<VisualActivityId, VisualActivityResponse>

export interface VisualEvaluationData {
  readable: FocusVisibility
  insufficientContrast: YesNo
  textSizeDifficult: YesNo
  colorOnly: YesNo
  problems: string
  improvements: string
}

export interface VisualConditions {
  brightness: BrightnessLevel
  glare: GlareLevel
  textScale: TextScale
}

export interface VisualConditionsUsed {
  brightness: BrightnessLevel[]
  glare: GlareLevel[]
  textScale: TextScale[]
}

export interface VisualReport {
  id: string
  challenge: 'visual'
  createdAt: string
  studentName: string
  mode: Mode
  elapsedSeconds: number
  activities: VisualActivityResponses
  evaluation: VisualEvaluationData
  conditionsUsed: VisualConditionsUsed
}

export type StoredReport = LabReport | VisualReport

export const emptyChallenge: ChallengeData = {
  fullName: '',
  email: '',
  identification: '',
  career: '',
  modality: '',
  interests: [],
  participationDate: '',
  comments: '',
  accepted: false,
}

export const emptyEvaluation: EvaluationData = {
  focusVisible: 'Sí',
  allReachable: 'Sí',
  logicalOrder: 'Sí',
  completed: 'Sí',
  keyboardSubmit: 'Sí',
  foundBarriers: 'No',
  barriers: '',
  improvements: '',
  difficulty: 'Moderado',
}

const emptyActivity = (): VisualActivityResponse => ({ answer: '', status: '' })

export const emptyVisualActivities: VisualActivityResponses = {
  deadline: emptyActivity(),
  contrast: emptyActivity(),
  statuses: emptyActivity(),
  error: emptyActivity(),
  smallText: emptyActivity(),
}

export const emptyVisualEvaluation: VisualEvaluationData = {
  readable: 'Sí',
  insufficientContrast: 'No',
  textSizeDifficult: 'No',
  colorOnly: 'No',
  problems: '',
  improvements: '',
}

export const defaultVisualConditions: VisualConditions = {
  brightness: 0,
  glare: 'none',
  textScale: 100,
}

export function isVisualReport(report: StoredReport): report is VisualReport {
  return report.challenge === 'visual'
}
