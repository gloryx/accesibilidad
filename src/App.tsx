import { Accessibility } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Challenge } from './components/Challenge'
import { Evaluation } from './components/Evaluation'
import { Home } from './components/Home'
import { Report } from './components/Report'
import { Setup } from './components/Setup'
import { Results } from './components/Results'
import { VisualChallenge } from './components/VisualChallenge'
import { VisualEvaluation } from './components/VisualEvaluation'
import { VisualReport } from './components/VisualReport'
import { VisualSetup } from './components/VisualSetup'
import { useTimer } from './hooks/useTimer'
import { defaultVisualConditions, emptyChallenge, emptyEvaluation, emptyVisualActivities, emptyVisualEvaluation, isVisualReport, type AppView, type ChallengeData, type EvaluationData, type LabReport, type Mode, type StoredReport, type VisualActivityResponses, type VisualConditions, type VisualConditionsUsed, type VisualEvaluationData, type VisualReport as VisualReportData } from './types'
import { exportReportToPdf } from './utils/pdf'
import { clearReports, loadReports, saveReport } from './utils/storage'

export default function App() {
  const [stage, setStage] = useState<AppView>('home')
  const [mode, setMode] = useState<Mode>('barriers')
  const [studentName, setStudentName] = useState('')
  const [challengeData, setChallengeData] = useState<ChallengeData>(emptyChallenge)
  const [evaluation, setEvaluation] = useState<EvaluationData>(emptyEvaluation)
  const [submitted, setSubmitted] = useState(false)
  const [visited, setVisited] = useState<Set<string>>(new Set())
  const [report, setReport] = useState<StoredReport | null>(null)
  const [visualActivities, setVisualActivities] = useState<VisualActivityResponses>(emptyVisualActivities)
  const [visualEvaluation, setVisualEvaluation] = useState<VisualEvaluationData>(emptyVisualEvaluation)
  const [visualConditions, setVisualConditions] = useState<VisualConditions>(defaultVisualConditions)
  const [visualConditionsUsed, setVisualConditionsUsed] = useState<VisualConditionsUsed>({ brightness: [0], glare: ['none'], textScale: [100] })
  const [showSolutions, setShowSolutions] = useState(false)
  const [savedCount, setSavedCount] = useState(() => loadReports().length)
  const keyboardNavigation = useRef(false)
  const { seconds, reset: resetTimer } = useTimer(stage === 'challenge' || stage === 'visual-challenge')

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') keyboardNavigation.current = true
    }
    const onPointer = () => { keyboardNavigation.current = false }
    window.addEventListener('keydown', onKeyDown, true)
    window.addEventListener('pointerdown', onPointer, true)
    return () => {
      window.removeEventListener('keydown', onKeyDown, true)
      window.removeEventListener('pointerdown', onPointer, true)
    }
  }, [])

  useEffect(() => {
    document.querySelector<HTMLElement>('#main-content')?.focus({ preventScroll: true })
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [stage])

  const resetExercise = (nextStage: AppView = 'setup') => {
    setStage(nextStage)
    setChallengeData(emptyChallenge)
    setEvaluation(emptyEvaluation)
    setSubmitted(false)
    setVisited(new Set())
    setReport(null)
    setShowSolutions(false)
    resetTimer()
  }

  const resetVisualExercise = (nextStage: AppView = 'visual-setup') => {
    setStage(nextStage)
    setVisualActivities(emptyVisualActivities)
    setVisualEvaluation(emptyVisualEvaluation)
    setVisualConditions(defaultVisualConditions)
    setVisualConditionsUsed({ brightness: [0], glare: ['none'], textScale: [100] })
    setReport(null)
    setShowSolutions(false)
    resetTimer()
  }

  const finishEvaluation = () => {
    const nextReport: LabReport = {
      id: crypto.randomUUID(),
      challenge: 'keyboard',
      createdAt: new Date().toISOString(),
      studentName: studentName.trim(),
      mode,
      elapsedSeconds: seconds,
      visitedControls: visited.size,
      evaluation,
    }
    saveReport(nextReport)
    setSavedCount(loadReports().length)
    setReport(nextReport)
    setStage('report')
  }

  const finishVisualEvaluation = () => {
    const nextReport: VisualReportData = {
      id: crypto.randomUUID(),
      challenge: 'visual',
      createdAt: new Date().toISOString(),
      studentName: studentName.trim(),
      mode,
      elapsedSeconds: seconds,
      activities: visualActivities,
      evaluation: visualEvaluation,
      conditionsUsed: visualConditionsUsed,
    }
    saveReport(nextReport)
    setSavedCount(loadReports().length)
    setReport(nextReport)
    setStage('visual-report')
  }

  const deleteSaved = () => {
    clearReports()
    setSavedCount(0)
  }

  const openLatestReport = () => {
    const latest = loadReports()[0]
    if (!latest) return
    setReport(latest)
    setStudentName(latest.studentName)
    setMode(latest.mode)
    setShowSolutions(false)
    setStage(isVisualReport(latest) ? 'visual-report' : 'report')
  }

  const openReport = (selected: StoredReport) => {
    setReport(selected)
    setStudentName(selected.studentName)
    setMode(selected.mode)
    setShowSolutions(false)
    setStage(isVisualReport(selected) ? 'visual-report' : 'report')
  }

  const updateVisualConditions = (next: VisualConditions) => {
    setVisualConditions(next)
    setVisualConditionsUsed((current) => ({
      brightness: current.brightness.includes(next.brightness) ? current.brightness : [...current.brightness, next.brightness],
      glare: current.glare.includes(next.glare) ? current.glare : [...current.glare, next.glare],
      textScale: current.textScale.includes(next.textScale) ? current.textScale : [...current.textScale, next.textScale],
    }))
  }

  const trackControl = (id: string) => {
    if (!keyboardNavigation.current) return
    setVisited((current) => {
      if (current.has(id)) return current
      const next = new Set(current)
      next.add(id)
      return next
    })
  }

  return (
    <>
      <a className="skip-link" href="#main-content">Saltar al contenido principal</a>
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#main-content" onClick={(event) => { event.preventDefault(); setStage('home') }}>
            <span><Accessibility aria-hidden="true" /></span>
            <span>LAB<span>/</span>ACCESS</span>
          </a>
          <nav className="lab-nav" aria-label="Navegación principal"><button onClick={() => setStage('home')}>Inicio</button><button onClick={() => resetExercise('setup')}>Reto A</button><button onClick={() => resetVisualExercise('visual-setup')}>Reto B</button><button onClick={() => setStage('results')}>Mis resultados</button></nav>
        </div>
      </header>

      {stage === 'home' && <Home savedCount={savedCount} onStartKeyboard={() => setStage('setup')} onStartVisual={() => setStage('visual-setup')} onResults={() => setStage('results')} onOpenLatest={openLatestReport} onClearSaved={deleteSaved} />}
      {stage === 'setup' && <Setup studentName={studentName} mode={mode} onNameChange={setStudentName} onModeChange={setMode} onBack={() => setStage('home')} onBegin={() => resetExercise('challenge')} />}
      {stage === 'challenge' && (
        <Challenge
          mode={mode}
          elapsedSeconds={seconds}
          visitedControls={visited.size}
          data={challengeData}
          submitted={submitted}
          onDataChange={setChallengeData}
          onControlFocus={trackControl}
          onSubmitted={() => setSubmitted(true)}
          onFinish={() => setStage('evaluation')}
          onRestart={() => resetExercise('challenge')}
          onChangeMode={() => { setMode((current) => current === 'barriers' ? 'accessible' : 'barriers'); resetExercise('challenge') }}
        />
      )}
      {stage === 'evaluation' && <Evaluation mode={mode} elapsedSeconds={seconds} value={evaluation} onChange={setEvaluation} onComplete={finishEvaluation} />}
      {stage === 'report' && report && !isVisualReport(report) && <Report report={report} showSolutions={showSolutions} savedCount={savedCount} onShowSolutions={() => setShowSolutions((value) => !value)} onExport={() => exportReportToPdf(report)} onRestart={() => resetExercise('setup')} onClearSaved={deleteSaved} />}
      {stage === 'visual-setup' && <VisualSetup studentName={studentName} mode={mode} onNameChange={setStudentName} onModeChange={setMode} onBack={() => setStage('home')} onBegin={() => resetVisualExercise('visual-challenge')} />}
      {stage === 'visual-challenge' && <VisualChallenge mode={mode} elapsedSeconds={seconds} conditions={visualConditions} activities={visualActivities} onConditionsChange={updateVisualConditions} onActivitiesChange={setVisualActivities} onFinish={() => setStage('visual-evaluation')} onRestart={() => resetVisualExercise('visual-challenge')} onChangeMode={() => { setMode((current) => current === 'barriers' ? 'accessible' : 'barriers'); resetVisualExercise('visual-challenge') }} />}
      {stage === 'visual-evaluation' && <VisualEvaluation mode={mode} elapsedSeconds={seconds} value={visualEvaluation} onChange={setVisualEvaluation} onComplete={finishVisualEvaluation} />}
      {stage === 'visual-report' && report && isVisualReport(report) && <VisualReport report={report} showSolutions={showSolutions} savedCount={savedCount} onShowSolutions={() => setShowSolutions((value) => !value)} onExport={() => exportReportToPdf(report)} onRestart={() => resetVisualExercise('visual-setup')} onClearSaved={deleteSaved} />}
      {stage === 'results' && <Results reports={loadReports()} onOpen={openReport} onClear={deleteSaved} onBack={() => setStage('home')} />}

      <footer><span>Laboratorio de Accesibilidad UX/UI</span><span>Práctica académica · WCAG 2.2</span></footer>
    </>
  )
}
