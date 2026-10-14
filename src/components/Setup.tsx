import { ArrowLeft, ArrowRight, Check, Keyboard } from 'lucide-react'
import { MODE_LABELS, RULES } from '../data'
import type { Mode } from '../types'

interface SetupProps {
  studentName: string
  mode: Mode
  onNameChange: (name: string) => void
  onModeChange: (mode: Mode) => void
  onBack: () => void
  onBegin: () => void
}

export function Setup({ studentName, mode, onNameChange, onModeChange, onBack, onBegin }: SetupProps) {
  const canBegin = studentName.trim().length >= 2

  return (
    <main id="main-content" className="page-shell narrow-page" tabIndex={-1}>
      <button className="button button-text back-button" onClick={onBack}>
        <ArrowLeft size={18} aria-hidden="true" /> Volver
      </button>
      <div className="section-heading">
        <p className="overline">Antes de comenzar</p>
        <h1>Reglas del desafío</h1>
        <p>Prepará tu recorrido. El cronómetro comenzará cuando pulses “Comenzar prueba”.</p>
      </div>

      <section className="setup-grid">
        <div className="panel rules-panel">
          <div className="panel-title"><Keyboard aria-hidden="true" /><h2>Navegación permitida</h2></div>
          <ol className="rules-list">
            {RULES.map((rule) => <li key={rule}><span><Check size={15} /></span>{rule}</li>)}
          </ol>
        </div>

        <form className="panel setup-form" onSubmit={(event) => { event.preventDefault(); if (canBegin) onBegin() }}>
          <h2>Configuración</h2>
          <div className="field">
            <label htmlFor="student-name">Nombre del estudiante</label>
            <input
              id="student-name"
              value={studentName}
              onChange={(event) => onNameChange(event.target.value)}
              required
              minLength={2}
              autoComplete="name"
            />
          </div>
          <fieldset className="mode-picker">
            <legend>Modo a evaluar</legend>
            {(['barriers', 'accessible'] as const).map((item) => (
              <label className={`mode-option ${mode === item ? 'selected' : ''}`} key={item}>
                <input type="radio" name="mode" checked={mode === item} onChange={() => onModeChange(item)} />
                <span><strong>{MODE_LABELS[item]}</strong><small>{item === 'barriers' ? 'Descubrí problemas sin pistas.' : 'Compará con buenas prácticas.'}</small></span>
              </label>
            ))}
          </fieldset>
          <button className="button button-primary" type="submit" disabled={!canBegin}>
            Comenzar prueba <ArrowRight size={18} aria-hidden="true" />
          </button>
        </form>
      </section>
    </main>
  )
}
