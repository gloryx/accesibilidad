import { CheckCircle2, Clock3, Eye, Flag, RefreshCw } from 'lucide-react'
import { MODE_LABELS } from '../data'
import { formatTime } from '../hooks/useTimer'
import type { ChallengeData, Mode } from '../types'
import { ChallengeForm } from './ChallengeForm'

interface ChallengeProps {
  mode: Mode
  elapsedSeconds: number
  visitedControls: number
  data: ChallengeData
  submitted: boolean
  onDataChange: (data: ChallengeData) => void
  onControlFocus: (id: string) => void
  onSubmitted: () => void
  onFinish: () => void
  onRestart: () => void
  onChangeMode: () => void
}

export function Challenge(props: ChallengeProps) {
  return (
    <main id="main-content" className="page-shell challenge-page" tabIndex={-1}>
      <div className="challenge-toolbar" aria-label="Estado del reto">
        <div className={`mode-badge ${props.mode}`}><span aria-hidden="true" />{MODE_LABELS[props.mode]}</div>
        <div className="metric"><Clock3 size={18} aria-hidden="true" /><span>Tiempo</span><strong>{formatTime(props.elapsedSeconds)}</strong></div>
        <div className="metric"><Eye size={18} aria-hidden="true" /><span>Controles visitados</span><strong>{props.visitedControls}</strong></div>
      </div>

      <div className="challenge-heading">
        <div><p className="overline">Reto en curso</p><h1>Formulario de inscripción a una actividad universitaria</h1></div>
        <div className="toolbar-actions">
          <button className="button button-secondary" onClick={props.onChangeMode}>Cambiar modo</button>
          <button className="button button-text" onClick={props.onRestart}><RefreshCw size={17} /> Reiniciar reto</button>
        </div>
      </div>

      <p className="keyboard-reminder"><strong>Recordatorio:</strong> utilizá únicamente Tab, Shift+Tab, Enter y barra espaciadora.</p>

      {props.submitted && (
        <div className="success-banner" role="status"><CheckCircle2 aria-hidden="true" /><span><strong>Inscripción enviada.</strong> Podés finalizar la prueba y registrar tus observaciones.</span></div>
      )}

      <section className="form-panel" aria-label="Formulario sometido a evaluación">
        <ChallengeForm mode={props.mode} data={props.data} onChange={props.onDataChange} onControlFocus={props.onControlFocus} onSubmitted={props.onSubmitted} />
      </section>

      <section className="finish-panel" aria-labelledby="finish-title">
        <div><Flag aria-hidden="true" /><div><h2 id="finish-title">¿Terminaste la exploración?</h2><p>Podés finalizar aunque una barrera te haya impedido completar o enviar el formulario.</p></div></div>
        <button className="button button-dark" onClick={props.onFinish}>Finalizar prueba</button>
      </section>
    </main>
  )
}
