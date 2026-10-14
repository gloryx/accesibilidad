import { ArrowRight, Eye, Keyboard, ShieldCheck } from 'lucide-react'
import { CRITERIA } from '../data'

interface HomeProps {
  savedCount: number
  onStartKeyboard: () => void
  onStartVisual: () => void
  onResults: () => void
  onOpenLatest: () => void
  onClearSaved: () => void
}

export function Home({ savedCount, onStartKeyboard, onStartVisual, onResults, onOpenLatest, onClearSaved }: HomeProps) {
  return (
    <main id="main-content" className="page-shell home-page" tabIndex={-1}>
      <section className="hero" aria-labelledby="page-title">
        <div className="eyebrow"><ShieldCheck size={17} /> Práctica guiada · UX/UI</div>
        <h1 id="page-title">Laboratorio de<br /><span>Accesibilidad Web</span></h1>
        <p className="hero-copy">
          Aprende a identificar barreras de accesibilidad mediante pruebas prácticas.
        </p>
      </section>

      <section className="home-challenges" aria-labelledby="challenges-title">
        <div className="challenges-heading"><p className="overline">Prácticas disponibles</p><h2 id="challenges-title">Elegí una barrera para experimentar</h2></div>
        <div className="challenge-cards-grid">
          <article className="challenge-card compact-card" aria-labelledby="challenge-a-title">
            <div className="challenge-number" aria-hidden="true">A</div>
            <div className="challenge-content">
              <p className="overline">Interacción y teclado</p>
              <h2 id="challenge-a-title">Reto A · Sin mouse</h2>
              <p>Completa un formulario utilizando exclusivamente Tab, Shift+Tab, Enter y barra espaciadora.</p>
              <ul className="challenge-points">{CRITERIA.slice(0, 3).map((criterion) => <li key={criterion}>{criterion}</li>)}</ul>
              <button className="button button-primary button-large" onClick={onStartKeyboard}>Iniciar reto <ArrowRight size={19} aria-hidden="true" /></button>
            </div>
            <Keyboard className="card-symbol" size={54} aria-hidden="true" />
          </article>

          <article className="challenge-card compact-card visual-card" aria-labelledby="challenge-b-title">
            <div className="challenge-number" aria-hidden="true">B</div>
            <div className="challenge-content">
              <p className="overline">Percepción y legibilidad</p>
              <h2 id="challenge-b-title">Reto B · Condiciones visuales difíciles</h2>
              <p>Experimenta cómo la iluminación y las decisiones de diseño afectan la lectura y comprensión de una interfaz.</p>
              <ul className="challenge-points"><li>Contraste y tamaño de texto.</li><li>Estados comunicados sólo mediante color.</li><li>Reflujo y legibilidad bajo reflejos.</li></ul>
              <button className="button button-primary button-large" onClick={onStartVisual}>Iniciar reto <ArrowRight size={19} aria-hidden="true" /></button>
            </div>
            <Eye className="card-symbol" size={54} aria-hidden="true" />
          </article>
        </div>
      </section>

      {savedCount > 0 && (
        <aside className="saved-notice" aria-label="Resultados guardados">
          <p><strong>{savedCount}</strong> {savedCount === 1 ? 'reporte guardado' : 'reportes guardados'} en este dispositivo.</p>
          <div className="saved-actions">
            <button className="button button-secondary" onClick={onResults}>Ver todos</button>
            <button className="button button-secondary" onClick={onOpenLatest}>Ver último reporte</button>
            <button className="button button-text danger" onClick={onClearSaved}>Eliminar resultados guardados</button>
          </div>
        </aside>
      )}
    </main>
  )
}
