import { Download, Eye, RotateCcw, Trash2 } from 'lucide-react'
import { MODE_LABELS, SOLUTIONS } from '../data'
import { formatTime } from '../hooks/useTimer'
import type { LabReport } from '../types'

interface ReportProps {
  report: LabReport
  showSolutions: boolean
  savedCount: number
  onShowSolutions: () => void
  onExport: () => void
  onRestart: () => void
  onClearSaved: () => void
}

const answerRows: Array<[string, keyof LabReport['evaluation']]> = [
  ['Foco visible', 'focusVisible'],
  ['Controles alcanzables', 'allReachable'],
  ['Orden lógico', 'logicalOrder'],
  ['Formulario completado', 'completed'],
  ['Envío con teclado', 'keyboardSubmit'],
  ['Barreras encontradas', 'foundBarriers'],
  ['Dificultad', 'difficulty'],
]

export function Report({ report, showSolutions, savedCount, onShowSolutions, onExport, onRestart, onClearSaved }: ReportProps) {
  return (
    <main id="main-content" className="page-shell report-page" tabIndex={-1}>
      <div className="report-hero">
        <p className="overline">Ejercicio finalizado</p>
        <h1>Reporte de accesibilidad</h1>
        <p>Tu análisis quedó guardado temporalmente en este dispositivo.</p>
      </div>

      <section className="report-summary" aria-label="Resumen del ejercicio">
        <div><span>Estudiante</span><strong>{report.studentName}</strong></div>
        <div><span>Modo evaluado</span><strong>{MODE_LABELS[report.mode]}</strong></div>
        <div><span>Tiempo empleado</span><strong>{formatTime(report.elapsedSeconds)}</strong></div>
        <div><span>Controles visitados</span><strong>{report.visitedControls}</strong></div>
      </section>

      <div className="report-grid">
        <section className="panel" aria-labelledby="answers-title">
          <h2 id="answers-title">Respuestas de la evaluación</h2>
          <dl className="answer-list">
            {answerRows.map(([label, key]) => <div key={key}><dt>{label}</dt><dd>{report.evaluation[key]}</dd></div>)}
          </dl>
        </section>
        <section className="panel observations-panel" aria-labelledby="observations-title">
          <h2 id="observations-title">Hallazgos y propuestas</h2>
          <h3>Problemas identificados</h3>
          <p>{report.evaluation.barriers || 'No se registraron observaciones.'}</p>
          <h3>Recomendaciones propuestas</h3>
          <p>{report.evaluation.improvements || 'No se registraron recomendaciones.'}</p>
        </section>
      </div>

      <div className="report-actions">
        <button className="button button-primary" onClick={onShowSolutions}><Eye size={18} /> {showSolutions ? 'Ocultar soluciones' : 'Ver soluciones y explicación'}</button>
        <button className="button button-secondary" onClick={onExport}><Download size={18} /> Exportar reporte a PDF</button>
        <button className="button button-secondary" onClick={onRestart}><RotateCcw size={18} /> Reiniciar reto</button>
      </div>

      {showSolutions && (
        <section className="solutions" aria-labelledby="solutions-title">
          <div className="solutions-heading"><p className="overline">Comparación técnica</p><h2 id="solutions-title">Soluciones y principios WCAG 2.2</h2><p>Una dificultad de uso no siempre es un incumplimiento. Acá se indica qué ocurre en cada caso.</p></div>
          <div className="solutions-list">
            {SOLUTIONS.map((solution, index) => (
              <article key={solution.title}>
                <span className="solution-index">{String(index + 1).padStart(2, '0')}</span>
                <div><h3>{solution.title}</h3><p>{solution.detail}</p><strong>{solution.criterion}</strong></div>
              </article>
            ))}
          </div>
          <aside className="usability-note">
            <strong>Usabilidad vs. accesibilidad</strong>
            <p>Una etiqueta poco clara o un formulario excesivamente largo puede perjudicar la usabilidad. Se convierte en incumplimiento de accesibilidad cuando excluye a personas por su forma de interacción, por ejemplo al exigir un mouse o hacer imperceptible el foco.</p>
          </aside>
        </section>
      )}

      <div className="storage-controls">
        <span>{savedCount} {savedCount === 1 ? 'reporte guardado' : 'reportes guardados'} localmente</span>
        <button className="button button-text danger" onClick={onClearSaved}><Trash2 size={17} /> Eliminar resultados guardados</button>
      </div>
    </main>
  )
}
