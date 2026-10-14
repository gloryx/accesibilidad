import { CaseSensitive, Sun, SunDim } from 'lucide-react'
import type { VisualConditions } from '../types'

interface VisualSimulatorProps {
  value: VisualConditions
  onChange: (value: VisualConditions) => void
}

const brightnessLabels = ['Normal', 'Reducción leve', 'Reducción moderada', 'Reducción intensa']

export function VisualSimulator({ value, onChange }: VisualSimulatorProps) {
  return (
    <section className="visual-simulator" aria-labelledby="simulator-title">
      <div className="simulator-heading"><div><p className="overline">Herramientas de prueba</p><h2 id="simulator-title">Simulador de condiciones de visualización</h2></div><p>Los efectos CSS se aplican sólo al portal. Son una aproximación visual y no modifican el monitor.</p></div>
      <div className="simulator-controls">
        <div className="simulator-control">
          <label htmlFor="brightness"><SunDim aria-hidden="true" /> Brillo reducido</label>
          <input id="brightness" type="range" min="0" max="3" step="1" value={value.brightness} onChange={(event) => onChange({ ...value, brightness: Number(event.target.value) as VisualConditions['brightness'] })} />
          <output htmlFor="brightness">{brightnessLabels[value.brightness]}</output>
        </div>
        <fieldset className="simulator-control">
          <legend><Sun aria-hidden="true" /> Luz intensa y reflejos</legend>
          <div className="compact-options">
            {[['none', 'Sin reflejo'], ['moderate', 'Moderado'], ['intense', 'Intenso']].map(([key, label]) => <label key={key}><input type="radio" name="glare" checked={value.glare === key} onChange={() => onChange({ ...value, glare: key as VisualConditions['glare'] })} />{label}</label>)}
          </div>
        </fieldset>
        <fieldset className="simulator-control">
          <legend><CaseSensitive aria-hidden="true" /> Tamaño del texto</legend>
          <div className="compact-options text-options">
            {([75, 100, 150, 200] as const).map((scale) => <label key={scale}><input type="radio" name="text-scale" checked={value.textScale === scale} onChange={() => onChange({ ...value, textScale: scale })} />{scale}%</label>)}
          </div>
        </fieldset>
      </div>
    </section>
  )
}
