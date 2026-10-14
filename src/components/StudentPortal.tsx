import { AlertCircle, CheckCircle2, Clock3, XCircle } from 'lucide-react'
import type { GlareLevel, Mode, TextScale } from '../types'

interface StudentPortalProps {
  mode: Mode
  brightness: number
  glare: GlareLevel
  textScale: TextScale
  preview?: boolean
}

const courses = [
  { code: 'UXD-204', name: 'Diseño de Interacción', status: 'Aprobada', className: 'approved', icon: CheckCircle2 },
  { code: 'HCI-301', name: 'Interfaces Humano-Computador', status: 'Pendiente', className: 'pending', icon: Clock3 },
  { code: 'COM-118', name: 'Comunicación Visual', status: 'Rechazada', className: 'rejected', icon: XCircle },
]

export function StudentPortal({ mode, brightness, glare, textScale, preview = false }: StudentPortalProps) {
  const accessible = mode === 'accessible'
  const brightnessValue = [1, .84, .66, .48][brightness] ?? 1
  return (
    <div className={`portal-viewport glare-${glare}`}>
      <article
        className={`student-portal ${accessible ? 'portal-accessible' : 'portal-problem'} text-${textScale}`}
        style={{ '--portal-brightness': brightnessValue, '--portal-scale': textScale / 100 } as React.CSSProperties}
        aria-label={preview ? 'Vista corregida del Portal de Servicios Estudiantiles' : 'Portal de Servicios Estudiantiles'}
      >
        <header className="portal-header">
          <div><span className="portal-mark">U</span><strong>Universidad Central</strong></div>
          <nav aria-label="Navegación del portal"><a href="#portal-summary">Inicio</a><a href="#portal-courses">Cursos</a><a href="#portal-profile">Mi perfil</a></nav>
        </header>
        <div className="portal-body">
          <div className="portal-welcome"><div><small>PERIODO 2026-2</small><h2>Portal de Servicios Estudiantiles</h2><p>Bienvenida, Valentina. Consultá tu información académica y tus trámites activos.</p></div><button type="button">Actualizar datos</button></div>

          <section className="portal-notice" aria-labelledby="portal-notice-title">
            {accessible && <AlertCircle aria-hidden="true" />}
            <div><strong id="portal-notice-title">Aviso académico</strong><p>La fecha límite para solicitar ajustes de matrícula es el <b>18/11/2026</b>. Después de esa fecha no se recibirán solicitudes.</p></div>
          </section>

          <section id="portal-summary" className="portal-stats" aria-label="Resumen académico">
            <div><span>Créditos inscritos</span><strong>18</strong></div><div><span>Cursos activos</span><strong>3</strong></div><div className="portal-secondary"><span>Promedio acumulado</span><strong>4,2</strong><small>Sobre una escala de 5,0</small></div>
          </section>

          <section id="portal-courses" className="portal-section">
            <div className="portal-section-heading"><div><small>SEMESTRE ACTUAL</small><h3>Cursos matriculados</h3></div><a href="#portal-courses">Ver historial académico</a></div>
            <table className="portal-table">
              <thead><tr><th>Código</th><th>Asignatura</th><th>Créditos</th><th>Estado</th></tr></thead>
              <tbody>
                {courses.map((course) => {
                  const Icon = course.icon
                  return <tr key={course.code}><td data-label="Código">{course.code}</td><td data-label="Asignatura">{course.name}</td><td data-label="Créditos">6</td><td data-label="Estado"><span className={`course-status ${course.className}`}>{accessible && <Icon size={14} aria-hidden="true" />}<i aria-hidden="true" />{accessible && course.status}</span></td></tr>
                })}
              </tbody>
            </table>
          </section>

          <section id="portal-profile" className="portal-section portal-profile">
            <div><small>DATOS DE CONTACTO</small><h3>Correo institucional</h3><p>Usaremos este correo para las comunicaciones académicas.</p></div>
            <form onSubmit={(event) => event.preventDefault()}>
              <label htmlFor={`portal-email-${mode}-${preview}`}>Correo electrónico</label>
              <div><input id={`portal-email-${mode}-${preview}`} defaultValue="valentina@mail.com" aria-describedby={`portal-error-${mode}-${preview}`} /><button type="submit">Guardar</button></div>
              <p id={`portal-error-${mode}-${preview}`} className="portal-error">{accessible && <><AlertCircle size={15} aria-hidden="true" /><strong>Error:</strong> </>}El correo institucional no coincide con el dominio autorizado.</p>
            </form>
          </section>

          <div className="portal-dates"><strong>Próximas fechas</strong><span>Evaluaciones parciales · 23 al 27 de noviembre</span><a href="#portal-dates">Consultar calendario completo</a></div>
        </div>
      </article>
      {glare !== 'none' && <div className="glare-overlay" aria-hidden="true" />}
    </div>
  )
}
