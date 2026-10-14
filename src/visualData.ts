import type { VisualActivityId, VisualActivityResponses } from './types'

export const VISUAL_RULES = [
  'Observá la interfaz universitaria sin buscar las soluciones.',
  'Probá los cuatro niveles de tamaño de texto.',
  'Compará al menos dos niveles de brillo y reflejo.',
  'Respondé las cinco actividades con la información visible.',
  'Marcá “No pude completarla” cuando la legibilidad lo impida.',
]

export const VISUAL_ACTIVITIES: Array<{
  id: VisualActivityId
  title: string
  prompt: string
  placeholder: string
}> = [
  { id: 'deadline', title: 'Actividad 1 · Lectura', prompt: '¿Cuál es la fecha límite del aviso académico?', placeholder: 'Escribí la fecha encontrada' },
  { id: 'contrast', title: 'Actividad 2 · Contraste', prompt: '¿Qué función tiene el botón principal del portal?', placeholder: 'Describí la acción del botón' },
  { id: 'statuses', title: 'Actividad 3 · Estados', prompt: 'Indicá el estado de cada curso matriculado.', placeholder: 'Curso: estado; curso: estado…' },
  { id: 'error', title: 'Actividad 4 · Error', prompt: '¿Qué problema informa el mensaje del formulario?', placeholder: 'Describí el error que encontraste' },
  { id: 'smallText', title: 'Actividad 5 · Tamaño', prompt: '¿Cuál es el promedio acumulado mostrado como información secundaria?', placeholder: 'Escribí el dato académico' },
]

export const VISUAL_SOLUTIONS = [
  {
    title: 'El color era el único identificador de estado',
    detail: 'Los puntos verde, amarillo y rojo no incluían texto ni iconos. La versión corregida combina color, icono y etiquetas “Aprobada”, “Pendiente” y “Rechazada”.',
    criterion: 'WCAG 2.2 · 1.4.1 Uso del color',
  },
  {
    title: 'Texto y acciones tenían contraste insuficiente',
    detail: 'El aviso, los textos secundarios y el botón principal se confundían con el fondo. La versión corregida utiliza combinaciones que superan los mínimos aplicables de 4.5:1 para texto normal y 3:1 para texto grande.',
    criterion: 'WCAG 2.2 · 1.4.3 Contraste mínimo',
  },
  {
    title: 'Los componentes no se distinguían con claridad',
    detail: 'Bordes, campos y controles tenían poco contraste. La corrección mantiene límites perceptibles y estados de interacción diferenciados.',
    criterion: 'WCAG 2.2 · 1.4.11 Contraste no textual',
  },
  {
    title: 'El tamaño base era demasiado pequeño',
    detail: 'Parte del contenido usaba entre 10 y 12 px. La versión accesible parte de 16 px y admite ampliación al 200 % sin recortar texto ni acciones.',
    criterion: 'WCAG 2.2 · 1.4.4 Cambio de tamaño del texto',
  },
  {
    title: 'La ampliación necesitaba reflujo',
    detail: 'La versión corregida transforma la tabla en tarjetas apiladas cuando el texto crece, evitando superposiciones y desplazamiento en dos dimensiones.',
    criterion: 'WCAG 2.2 · 1.4.10 Reflow',
  },
  {
    title: 'El contenido debe tolerar ajustes de espaciado',
    detail: 'La interfaz corregida evita alturas fijas y deja que bloques, botones y filas crezcan con el texto y el espaciado.',
    criterion: 'WCAG 2.2 · 1.4.12 Espaciado del texto',
  },
]

const normalize = (value: string) => value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '')

export function isActivityCorrect(id: VisualActivityId, answer: string) {
  const value = normalize(answer)
  if (id === 'deadline') return value.includes('18') && (value.includes('11') || value.includes('noviembre')) && value.includes('2026')
  if (id === 'contrast') return value.includes('actualizar') && (value.includes('dato') || value.includes('perfil'))
  if (id === 'statuses') return value.includes('interaccion') && value.includes('aprob') && value.includes('interfaces') && value.includes('pend') && value.includes('comunicacion') && value.includes('rech')
  if (id === 'error') return value.includes('correo') && (value.includes('inval') || value.includes('coincid'))
  return value.includes('4,2') || value.includes('4.2')
}

export function countVisualActivities(activities: VisualActivityResponses) {
  const values = Object.entries(activities) as Array<[VisualActivityId, VisualActivityResponses[VisualActivityId]]>
  return {
    completed: values.filter(([, activity]) => activity.status === 'completed').length,
    unable: values.filter(([, activity]) => activity.status === 'unable').length,
    correct: values.filter(([id, activity]) => activity.status === 'completed' && isActivityCorrect(id, activity.answer)).length,
  }
}
