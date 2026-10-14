import { ArrowRight, ClipboardCheck, Clock3 } from 'lucide-react'
import { MODE_LABELS } from '../data'
import { formatTime } from '../hooks/useTimer'
import type { EvaluationData, Mode } from '../types'

interface EvaluationProps {
  mode: Mode
  elapsedSeconds: number
  value: EvaluationData
  onChange: (value: EvaluationData) => void
  onComplete: () => void
}

interface QuestionProps {
  legend: string
  name: keyof EvaluationData
  options: string[]
  value: string
  onChange: (value: string) => void
}

function Question({ legend, name, options, value, onChange }: QuestionProps) {
  return (
    <fieldset className="evaluation-question">
      <legend>{legend}</legend>
      <div className="segmented-options">
        {options.map((option) => (
          <label key={option} className={value === option ? 'selected' : ''}>
            <input type="radio" name={name} checked={value === option} onChange={() => onChange(option)} />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function Evaluation({ mode, elapsedSeconds, value, onChange, onComplete }: EvaluationProps) {
  const set = (key: keyof EvaluationData, fieldValue: string) => onChange({ ...value, [key]: fieldValue })

  return (
    <main id="main-content" className="page-shell narrow-page" tabIndex={-1}>
      <div className="section-heading evaluation-title">
        <div className="eyebrow"><ClipboardCheck size={17} /> Registro de observaciones</div>
        <h1>Evaluá tu experiencia</h1>
        <p>Respondé según lo que experimentaste, no según lo que esperabas encontrar.</p>
        <div className="evaluation-meta"><span>{MODE_LABELS[mode]}</span><span><Clock3 size={16} /> {formatTime(elapsedSeconds)}</span></div>
      </div>

      <form className="panel evaluation-form" onSubmit={(event) => { event.preventDefault(); onComplete() }}>
        <div className="questions-grid">
          <Question legend="¿El foco fue visible en todo momento?" name="focusVisible" options={['Sí', 'No', 'Parcialmente']} value={value.focusVisible} onChange={(v) => set('focusVisible', v)} />
          <Question legend="¿Todos los controles fueron alcanzables?" name="allReachable" options={['Sí', 'No']} value={value.allReachable} onChange={(v) => set('allReachable', v)} />
          <Question legend="¿El orden de navegación fue lógico?" name="logicalOrder" options={['Sí', 'No']} value={value.logicalOrder} onChange={(v) => set('logicalOrder', v)} />
          <Question legend="¿Pudiste completar el formulario?" name="completed" options={['Sí', 'No']} value={value.completed} onChange={(v) => set('completed', v)} />
          <Question legend="¿Pudiste enviarlo usando el teclado?" name="keyboardSubmit" options={['Sí', 'No']} value={value.keyboardSubmit} onChange={(v) => set('keyboardSubmit', v)} />
          <Question legend="¿Encontraste barreras de accesibilidad?" name="foundBarriers" options={['Sí', 'No']} value={value.foundBarriers} onChange={(v) => set('foundBarriers', v)} />
        </div>

        <div className="field">
          <label htmlFor="barriers">Describí las barreras encontradas</label>
          <textarea id="barriers" rows={4} value={value.barriers} onChange={(e) => set('barriers', e.target.value)} placeholder="¿Qué control presentó el problema y qué ocurrió?" />
        </div>
        <div className="field">
          <label htmlFor="improvements">Proponé mejoras</label>
          <textarea id="improvements" rows={4} value={value.improvements} onChange={(e) => set('improvements', e.target.value)} placeholder="¿Cómo corregirías la experiencia?" />
        </div>

        <fieldset className="difficulty-picker">
          <legend>Nivel de dificultad percibida</legend>
          <div className="segmented-options large">
            {['Fácil', 'Moderado', 'Difícil'].map((option) => (
              <label key={option} className={value.difficulty === option ? 'selected' : ''}>
                <input type="radio" name="difficulty" checked={value.difficulty === option} onChange={() => set('difficulty', option)} />{option}
              </label>
            ))}
          </div>
        </fieldset>

        <button className="button button-primary button-large submit-evaluation" type="submit">
          Generar reporte <ArrowRight size={19} aria-hidden="true" />
        </button>
      </form>
    </main>
  )
}
