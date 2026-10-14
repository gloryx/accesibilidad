import { Download, Eye, RotateCcw, Trash2 } from 'lucide-react'
import { MODE_LABELS } from '../data'
import { formatTime } from '../hooks/useTimer'
import type { VisualActivityId, VisualReport as VisualReportData } from '../types'
import { countVisualActivities, isActivityCorrect, VISUAL_ACTIVITIES, VISUAL_SOLUTIONS } from '../visualData'
import { StudentPortal } from './StudentPortal'

interface VisualReportProps {
  report: VisualReportData
  showSolutions: boolean
  savedCount: number
  onShowSolutions: () => void
  onExport: () => void
  onRestart: () => void
  onClearSaved: () => void
}

const brightnessNames = ['Normal', 'Leve', 'Moderada', 'Intensa']
const glareNames = { none: 'Sin reflejo', moderate: 'Moderado', intense: 'Intenso' }

export function VisualReport({ report, showSolutions, savedCount, onShowSolutions, onExport, onRestart, onClearSaved }: VisualReportProps) {
  const totals = countVisualActivities(report.activities)
  return (
    <main id="main-content" className="page-shell report-page" tabIndex={-1}>
      <div className="report-hero"><p className="overline">Reto B finalizado</p><h1>Reporte de accesibilidad visual</h1><p>Resultados de la exploración del Portal de Servicios Estudiantiles.</p></div>
      <section className="report-summary visual-report-summary" aria-label="Resumen del ejercicio">
        <div><span>Estudiante</span><strong>{report.studentName}</strong></div><div><span>Modo evaluado</span><strong>{MODE_LABELS[report.mode]}</strong></div><div><span>Fecha</span><strong>{new Date(report.createdAt).toLocaleDateString('es')}</strong></div><div><span>Tiempo</span><strong>{formatTime(report.elapsedSeconds)}</strong></div><div><span>Actividades</span><strong>{totals.completed} completadas · {totals.unable} no completadas</strong></div>
      </section>

      <div className="report-grid">
        <section className="panel" aria-labelledby="activity-results-title">
          <h2 id="activity-results-title">Actividades registradas</h2>
          <div className="report-activity-list">
            {VISUAL_ACTIVITIES.map((activity) => {
              const response = report.activities[activity.id]
              return <div key={activity.id}><span>{response.status === 'completed' ? 'Completada' : response.status === 'unable' ? 'No completada' : 'Sin responder'}</span><strong>{activity.title}</strong><p>{response.answer || 'Sin respuesta registrada.'}</p>{showSolutions && response.status === 'completed' && <small className={isActivityCorrect(activity.id, response.answer) ? 'answer-correct' : 'answer-review'}>{isActivityCorrect(activity.id, response.answer) ? 'Respuesta coincidente' : 'Revisar con la solución'}</small>}</div>
            })}
          </div>
        </section>
        <section className="panel observations-panel" aria-labelledby="visual-observations-title">
          <h2 id="visual-observations-title">Evaluación y condiciones</h2>
          <dl className="answer-list"><div><dt>Lectura fácil</dt><dd>{report.evaluation.readable}</dd></div><div><dt>Contraste insuficiente</dt><dd>{report.evaluation.insufficientContrast}</dd></div><div><dt>Tamaño difícil</dt><dd>{report.evaluation.textSizeDifficult}</dd></div><div><dt>Dependencia del color</dt><dd>{report.evaluation.colorOnly}</dd></div></dl>
          <h3>Condiciones utilizadas</h3><p>Brillo: {report.conditionsUsed.brightness.map((level) => brightnessNames[level]).join(', ')}.<br />Reflejo: {report.conditionsUsed.glare.map((level) => glareNames[level]).join(', ')}.<br />Texto: {report.conditionsUsed.textScale.map((scale) => `${scale}%`).join(', ')}.</p>
          <h3>Problemas identificados</h3><p>{report.evaluation.problems || 'No se registraron observaciones.'}</p><h3>Recomendaciones</h3><p>{report.evaluation.improvements || 'No se registraron recomendaciones.'}</p>
        </section>
      </div>

      <div className="report-actions"><button className="button button-primary" onClick={onShowSolutions}><Eye size={18} /> {showSolutions ? 'Ocultar soluciones' : 'Ver soluciones y explicación'}</button><button className="button button-secondary" onClick={onExport}><Download size={18} /> Exportar reporte a PDF</button><button className="button button-secondary" onClick={onRestart}><RotateCcw size={18} /> Reiniciar reto</button></div>

      {showSolutions && <section className="solutions visual-solutions" aria-labelledby="visual-solutions-title">
        <div className="solutions-heading"><p className="overline">Comparación técnica</p><h2 id="visual-solutions-title">Soluciones y criterios WCAG 2.2</h2><p>Respuestas esperadas: fecha límite 18/11/2026; botón “Actualizar datos”; Diseño de Interacción aprobada, Interfaces Humano-Computador pendiente y Comunicación Visual rechazada; correo institucional inválido; promedio acumulado 4,2.</p></div>
        <div className="solutions-list">{VISUAL_SOLUTIONS.map((solution, index) => <article key={solution.title}><span className="solution-index">{String(index + 1).padStart(2, '0')}</span><div><h3>{solution.title}</h3><p>{solution.detail}</p><strong>{solution.criterion}</strong></div></article>)}</div>
        <div className="corrected-preview"><div><p className="overline">Versión corregida</p><h3>El mismo portal con apoyos visuales accesibles</h3></div><StudentPortal mode="accessible" brightness={0} glare="none" textScale={100} preview /></div>
      </section>}

      <div className="storage-controls"><span>{savedCount} {savedCount === 1 ? 'reporte guardado' : 'reportes guardados'} localmente</span><button className="button button-text danger" onClick={onClearSaved}><Trash2 size={17} /> Eliminar resultados guardados</button></div>
    </main>
  )
}
