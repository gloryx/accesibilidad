import { ArrowRight, ClipboardCheck, Clock3 } from 'lucide-react'
import { MODE_LABELS } from '../data'
import { formatTime } from '../hooks/useTimer'
import type { Mode, VisualEvaluationData } from '../types'

interface VisualEvaluationProps {
  mode: Mode
  elapsedSeconds: number
  value: VisualEvaluationData
  onChange: (value: VisualEvaluationData) => void
  onComplete: () => void
}

function VisualQuestion({ legend, name, options, value, onChange }: { legend: string; name: string; options: string[]; value: string; onChange: (value: string) => void }) {
  return <fieldset className="evaluation-question"><legend>{legend}</legend><div className="segmented-options">{options.map((option) => <label key={option} className={value === option ? 'selected' : ''}><input type="radio" name={name} checked={value === option} onChange={() => onChange(option)} />{option}</label>)}</div></fieldset>
}

export function VisualEvaluation({ mode, elapsedSeconds, value, onChange, onComplete }: VisualEvaluationProps) {
  const set = (key: keyof VisualEvaluationData, fieldValue: string) => onChange({ ...value, [key]: fieldValue })
  return (
    <main id="main-content" className="page-shell narrow-page" tabIndex={-1}>
      <div className="section-heading evaluation-title"><div className="eyebrow"><ClipboardCheck size={17} /> Cuestionario visual</div><h1>Evaluá lo que percibiste</h1><p>Las soluciones siguen ocultas. Respondé a partir de tu experiencia con el portal.</p><div className="evaluation-meta"><span>{MODE_LABELS[mode]}</span><span><Clock3 size={16} /> {formatTime(elapsedSeconds)}</span></div></div>
      <form className="panel evaluation-form" onSubmit={(event) => { event.preventDefault(); onComplete() }}>
        <div className="questions-grid">
          <VisualQuestion legend="¿Fue posible leer todo el contenido con facilidad?" name="readable" options={['Sí', 'No', 'Parcialmente']} value={value.readable} onChange={(answer) => set('readable', answer)} />
          <VisualQuestion legend="¿Encontraste textos o botones con contraste insuficiente?" name="insufficientContrast" options={['Sí', 'No']} value={value.insufficientContrast} onChange={(answer) => set('insufficientContrast', answer)} />
          <VisualQuestion legend="¿El tamaño de letra dificultó la lectura?" name="textSizeDifficult" options={['Sí', 'No']} value={value.textSizeDifficult} onChange={(answer) => set('textSizeDifficult', answer)} />
          <VisualQuestion legend="¿La interfaz utilizaba exclusivamente colores para transmitir información?" name="colorOnly" options={['Sí', 'No']} value={value.colorOnly} onChange={(answer) => set('colorOnly', answer)} />
        </div>
        <div className="field"><label htmlFor="visual-problems">Problemas encontrados</label><textarea id="visual-problems" rows={4} value={value.problems} onChange={(event) => set('problems', event.target.value)} placeholder="Describí qué contenido o control fue difícil de percibir" /></div>
        <div className="field"><label htmlFor="visual-improvements">¿Qué cambios mejorarían la accesibilidad visual?</label><textarea id="visual-improvements" rows={4} value={value.improvements} onChange={(event) => set('improvements', event.target.value)} placeholder="Proponé mejoras de contraste, tipografía, estados o reflujo" /></div>
        <button className="button button-primary button-large submit-evaluation" type="submit">Generar reporte <ArrowRight size={19} /></button>
      </form>
    </main>
  )
}
