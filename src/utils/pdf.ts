import { MODE_LABELS } from '../data'
import { formatTime } from '../hooks/useTimer'
import { isVisualReport, type StoredReport, type VisualReport } from '../types'

const activityLabels: Record<keyof VisualReport['activities'], string> = {
  deadline: 'Lectura del aviso académico',
  contrast: 'Identificación del botón',
  statuses: 'Interpretación de estados',
  error: 'Identificación del error',
  smallText: 'Lectura de información secundaria',
}

export async function exportReportToPdf(report: StoredReport) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF()
  const margin = 18
  const width = 174
  let y = 20

  const addText = (text: string, size = 11, gap = 6) => {
    doc.setFontSize(size)
    const lines = doc.splitTextToSize(text, width)
    const height = lines.length * gap
    if (y + height > 280) {
      doc.addPage()
      y = 20
    }
    doc.text(lines, margin, y)
    y += height
  }

  doc.setFont('helvetica', 'bold')
  addText('Laboratorio de Accesibilidad Web', 18, 8)
  doc.setFont('helvetica', 'normal')
  addText(`Estudiante: ${report.studentName}`)
  addText(`Reto: ${isVisualReport(report) ? 'Reto B - Condiciones visuales difíciles' : 'Reto A - Sin mouse'}`)
  addText(`Modo: ${MODE_LABELS[report.mode]}`)
  addText(`Tiempo empleado: ${formatTime(report.elapsedSeconds)}`)

  if (isVisualReport(report)) {
    addText(`Fecha: ${new Date(report.createdAt).toLocaleDateString('es')}`)
    y += 4
    doc.setFont('helvetica', 'bold')
    addText('Actividades', 14, 7)
    doc.setFont('helvetica', 'normal')
    Object.entries(report.activities).forEach(([id, activity]) => {
      const label = activityLabels[id as keyof VisualReport['activities']]
      const status = activity.status === 'completed' ? 'Completada' : activity.status === 'unable' ? 'No completada' : 'Sin responder'
      addText(`${label}: ${status}. Respuesta: ${activity.answer || 'Sin respuesta'}`)
    })
    y += 4
    doc.setFont('helvetica', 'bold')
    addText('Cuestionario', 14, 7)
    doc.setFont('helvetica', 'normal')
    addText(`Lectura fácil: ${report.evaluation.readable}`)
    addText(`Contraste insuficiente: ${report.evaluation.insufficientContrast}`)
    addText(`Tamaño dificultó la lectura: ${report.evaluation.textSizeDifficult}`)
    addText(`Uso exclusivo del color: ${report.evaluation.colorOnly}`)
    addText(`Brillo utilizado: ${report.conditionsUsed.brightness.join(', ')}`)
    addText(`Reflejo utilizado: ${report.conditionsUsed.glare.join(', ')}`)
    addText(`Escalas de texto utilizadas: ${report.conditionsUsed.textScale.map((value) => `${value}%`).join(', ')}`)
    y += 4
    doc.setFont('helvetica', 'bold')
    addText('Problemas identificados', 14, 7)
    doc.setFont('helvetica', 'normal')
    addText(report.evaluation.problems || 'No se registraron observaciones.')
    y += 4
    doc.setFont('helvetica', 'bold')
    addText('Recomendaciones propuestas', 14, 7)
    doc.setFont('helvetica', 'normal')
    addText(report.evaluation.improvements || 'No se registraron recomendaciones.')
  } else {
    addText(`Controles visitados: ${report.visitedControls}`)
    y += 4
    doc.setFont('helvetica', 'bold')
    addText('Resultados de la evaluación', 14, 7)
    doc.setFont('helvetica', 'normal')
    addText(`Foco visible: ${report.evaluation.focusVisible}`)
    addText(`Todos los controles alcanzables: ${report.evaluation.allReachable}`)
    addText(`Orden lógico: ${report.evaluation.logicalOrder}`)
    addText(`Formulario completado: ${report.evaluation.completed}`)
    addText(`Envío con teclado: ${report.evaluation.keyboardSubmit}`)
    addText(`Barreras encontradas: ${report.evaluation.foundBarriers}`)
    addText(`Dificultad: ${report.evaluation.difficulty}`)
    y += 4
    doc.setFont('helvetica', 'bold')
    addText('Problemas identificados', 14, 7)
    doc.setFont('helvetica', 'normal')
    addText(report.evaluation.barriers || 'No se registraron observaciones.')
    y += 4
    doc.setFont('helvetica', 'bold')
    addText('Recomendaciones propuestas', 14, 7)
    doc.setFont('helvetica', 'normal')
    addText(report.evaluation.improvements || 'No se registraron recomendaciones.')
  }
  doc.save(`reporte-accesibilidad-${report.studentName.trim().replace(/\s+/g, '-').toLowerCase()}.pdf`)
}
