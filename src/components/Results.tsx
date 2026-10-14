import { ArrowLeft, Eye, Keyboard, Trash2 } from 'lucide-react'
import { MODE_LABELS } from '../data'
import { formatTime } from '../hooks/useTimer'
import { isVisualReport, type StoredReport } from '../types'

interface ResultsProps {
  reports: StoredReport[]
  onOpen: (report: StoredReport) => void
  onClear: () => void
  onBack: () => void
}

export function Results({ reports, onOpen, onClear, onBack }: ResultsProps) {
  return (
    <main id="main-content" className="page-shell results-page" tabIndex={-1}>
      <button className="button button-text back-button" onClick={onBack}><ArrowLeft size={18} /> Volver al inicio</button>
      <div className="section-heading"><p className="overline">Historial local</p><h1>Mis resultados</h1><p>Los reportes se guardan únicamente en este navegador. Podés abrirlos, exportarlos o eliminarlos.</p></div>
      {reports.length === 0 ? <section className="empty-results"><Eye size={42} aria-hidden="true" /><h2>Todavía no hay resultados</h2><p>Completá el Reto A o el Reto B para generar tu primer reporte.</p></section> : <>
        <div className="results-list">{reports.map((report) => {
          const visual = isVisualReport(report)
          return <article className="result-card" key={report.id}><span className={`result-icon ${visual ? 'visual' : ''}`}>{visual ? <Eye aria-hidden="true" /> : <Keyboard aria-hidden="true" />}</span><div><p className="overline">{visual ? 'Reto B' : 'Reto A'}</p><h2>{visual ? 'Condiciones visuales difíciles' : 'Sin mouse'}</h2><p>{report.studentName} · {new Date(report.createdAt).toLocaleDateString('es')} · {formatTime(report.elapsedSeconds)}</p></div><span className="result-mode">{MODE_LABELS[report.mode]}</span><button className="button button-secondary" onClick={() => onOpen(report)}>Abrir reporte</button></article>
        })}</div>
        <button className="button button-text danger clear-all-results" onClick={onClear}><Trash2 size={17} /> Eliminar todos los resultados</button>
      </>}
    </main>
  )
}
