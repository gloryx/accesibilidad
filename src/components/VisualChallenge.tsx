import { Clock3, Flag, RefreshCw } from 'lucide-react'
import { MODE_LABELS } from '../data'
import { formatTime } from '../hooks/useTimer'
import type { Mode, VisualActivityResponses, VisualConditions } from '../types'
import { StudentPortal } from './StudentPortal'
import { VisualActivities } from './VisualActivities'
import { VisualSimulator } from './VisualSimulator'

interface VisualChallengeProps {
  mode: Mode
  elapsedSeconds: number
  conditions: VisualConditions
  activities: VisualActivityResponses
  onConditionsChange: (value: VisualConditions) => void
  onActivitiesChange: (value: VisualActivityResponses) => void
  onFinish: () => void
  onRestart: () => void
  onChangeMode: () => void
}

export function VisualChallenge(props: VisualChallengeProps) {
  const answered = Object.values(props.activities).filter((activity) => activity.status).length
  return (
    <main id="main-content" className="page-shell visual-challenge-page" tabIndex={-1}>
      <div className="challenge-toolbar" aria-label="Estado del reto visual">
        <div className={`mode-badge ${props.mode}`}><span aria-hidden="true" />{MODE_LABELS[props.mode]}</div>
        <div className="metric"><Clock3 size={18} /><span>Tiempo</span><strong>{formatTime(props.elapsedSeconds)}</strong></div>
        <div className="metric"><Flag size={18} /><span>Actividades registradas</span><strong>{answered}/5</strong></div>
      </div>
      <div className="challenge-heading">
        <div><p className="overline">Reto B en curso</p><h1>Condiciones visuales difíciles</h1></div>
        <div className="toolbar-actions"><button className="button button-secondary" onClick={props.onChangeMode}>Cambiar modo</button><button className="button button-text" onClick={props.onRestart}><RefreshCw size={17} /> Reiniciar reto</button></div>
      </div>
      <VisualSimulator value={props.conditions} onChange={props.onConditionsChange} />
      <section className="evaluated-interface" aria-labelledby="portal-test-title">
        <div className="evaluated-label"><span>Interfaz sometida a prueba</span><h2 id="portal-test-title" className="visually-hidden">Portal universitario evaluado</h2></div>
        <StudentPortal mode={props.mode} brightness={props.conditions.brightness} glare={props.conditions.glare} textScale={props.conditions.textScale} />
      </section>
      <VisualActivities value={props.activities} onChange={props.onActivitiesChange} />
      <section className="finish-panel" aria-labelledby="visual-finish-title"><div><Flag aria-hidden="true" /><div><h2 id="visual-finish-title">¿Terminaste la exploración?</h2><p>Podés finalizar aunque una o más actividades no hayan podido completarse.</p></div></div><button className="button button-dark" onClick={props.onFinish}>Finalizar prueba</button></section>
    </main>
  )
}
