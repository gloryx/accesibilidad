import { ArrowLeft, ArrowRight, Check, Eye } from 'lucide-react'
import { MODE_LABELS } from '../data'
import type { Mode } from '../types'
import { VISUAL_RULES } from '../visualData'

interface VisualSetupProps {
  studentName: string
  mode: Mode
  onNameChange: (name: string) => void
  onModeChange: (mode: Mode) => void
  onBack: () => void
  onBegin: () => void
}

export function VisualSetup({ studentName, mode, onNameChange, onModeChange, onBack, onBegin }: VisualSetupProps) {
  const canBegin = studentName.trim().length >= 2
  return (
    <main id="main-content" className="page-shell narrow-page" tabIndex={-1}>
      <button className="button button-text back-button" onClick={onBack}><ArrowLeft size={18} /> Volver</button>
      <div className="section-heading">
        <p className="overline">Reto B · Preparación</p>
        <h1>Condiciones visuales difíciles</h1>
        <p>Interpretá un portal universitario bajo condiciones visuales desfavorables y documentá qué información deja de ser clara.</p>
      </div>
      <section className="setup-grid">
        <div className="panel rules-panel">
          <div className="panel-title"><Eye aria-hidden="true" /><h2>Reglas del desafío</h2></div>
          <ol className="rules-list">
            {VISUAL_RULES.map((rule) => <li key={rule}><span><Check size={15} /></span>{rule}</li>)}
          </ol>
          <p className="simulation-note">Las condiciones son aproximaciones visuales creadas con CSS. No modifican el brillo físico del monitor ni reproducen fielmente una pantalla bajo luz solar.</p>
        </div>
        <form className="panel setup-form" onSubmit={(event) => { event.preventDefault(); if (canBegin) onBegin() }}>
          <h2>Configuración</h2>
          <div className="field">
            <label htmlFor="visual-student-name">Nombre del estudiante</label>
            <input id="visual-student-name" value={studentName} onChange={(event) => onNameChange(event.target.value)} required minLength={2} autoComplete="name" />
          </div>
          <fieldset className="mode-picker">
            <legend>Diseño a evaluar</legend>
            {(['barriers', 'accessible'] as const).map((item) => (
              <label className={`mode-option ${mode === item ? 'selected' : ''}`} key={item}>
                <input type="radio" name="visual-mode" checked={mode === item} onChange={() => onModeChange(item)} />
                <span><strong>{MODE_LABELS[item]}</strong><small>{item === 'barriers' ? 'Evaluá los problemas sin pistas.' : 'Compará la versión corregida.'}</small></span>
              </label>
            ))}
          </fieldset>
          <button className="button button-primary" type="submit" disabled={!canBegin}>Comenzar prueba <ArrowRight size={18} /></button>
        </form>
      </section>
    </main>
  )
}
