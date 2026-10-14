import { CircleAlert, CircleCheck } from 'lucide-react'
import type { VisualActivityId, VisualActivityResponses } from '../types'
import { VISUAL_ACTIVITIES } from '../visualData'

interface VisualActivitiesProps {
  value: VisualActivityResponses
  onChange: (value: VisualActivityResponses) => void
}

export function VisualActivities({ value, onChange }: VisualActivitiesProps) {
  const update = (id: VisualActivityId, patch: Partial<VisualActivityResponses[VisualActivityId]>) => onChange({ ...value, [id]: { ...value[id], ...patch } })
  return (
    <section className="visual-activities" aria-labelledby="activities-title">
      <div className="activities-heading"><p className="overline">Registro de hallazgos</p><h2 id="activities-title">Cinco actividades prácticas</h2><p>Respondé con la información del portal. Si no podés leerla, registralo: también es un resultado válido.</p></div>
      <div className="activity-list">
        {VISUAL_ACTIVITIES.map((activity, index) => {
          const response = value[activity.id]
          return (
            <article className={`activity-card ${response.status ? `status-${response.status}` : ''}`} key={activity.id}>
              <span className="activity-number">0{index + 1}</span>
              <div className="activity-content">
                <h3>{activity.title}</h3><p>{activity.prompt}</p>
                <label className="visually-hidden" htmlFor={`activity-${activity.id}`}>Respuesta para {activity.title}</label>
                <input id={`activity-${activity.id}`} value={response.answer} onChange={(event) => update(activity.id, { answer: event.target.value, status: response.status === 'unable' ? '' : response.status })} placeholder={activity.placeholder} disabled={response.status === 'unable'} />
                <div className="activity-status-actions" aria-label={`Estado de ${activity.title}`}>
                  <button type="button" className={response.status === 'completed' ? 'selected' : ''} onClick={() => update(activity.id, { status: 'completed' })}><CircleCheck size={16} /> Marcar completada</button>
                  <button type="button" className={response.status === 'unable' ? 'selected unable' : ''} onClick={() => update(activity.id, { status: 'unable', answer: '' })}><CircleAlert size={16} /> No pude completarla</button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
