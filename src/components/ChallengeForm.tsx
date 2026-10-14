import { useState, type FormEvent } from 'react'
import type { ChallengeData, Mode } from '../types'

interface ChallengeFormProps {
  mode: Mode
  data: ChallengeData
  onChange: (data: ChallengeData) => void
  onSubmitted: () => void
  onControlFocus: (controlId: string) => void
}

type Errors = Partial<Record<keyof ChallengeData, string>>

export function ChallengeForm({ mode, data, onChange, onSubmitted, onControlFocus }: ChallengeFormProps) {
  const [errors, setErrors] = useState<Errors>({})
  const isBarrierMode = mode === 'barriers'

  const update = <K extends keyof ChallengeData>(key: K, value: ChallengeData[K]) => {
    onChange({ ...data, [key]: value })
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const validate = () => {
    const next: Errors = {}
    if (!data.fullName.trim()) next.fullName = 'Ingresá el nombre completo.'
    if (!/^\S+@\S+\.\S+$/.test(data.email)) next.email = 'Ingresá un correo electrónico válido.'
    if (!data.identification.trim()) next.identification = 'Ingresá el número de identificación.'
    if (!data.career) next.career = 'Seleccioná una carrera.'
    if (!data.modality) next.modality = 'Seleccioná una modalidad.'
    if (!data.participationDate) next.participationDate = 'Seleccioná una fecha.'
    if (!data.accepted) next.accepted = 'Debés aceptar las condiciones.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = (event?: FormEvent) => {
    event?.preventDefault()
    if (validate()) onSubmitted()
  }

  const trackFocus = (event: React.FocusEvent<HTMLFormElement>) => {
    const id = (event.target as HTMLElement).dataset.controlId
    if (id) onControlFocus(id)
  }

  const describedBy = (key: keyof ChallengeData) => errors[key] ? `${key}-error` : undefined

  return (
    <form className={`activity-form ${isBarrierMode ? 'barrier-form' : 'accessible-form'}`} onSubmit={submit} onFocusCapture={trackFocus} noValidate>
      {Object.keys(errors).length > 0 && (
        <div className="error-summary" role="alert">
          <strong>Revisá los campos indicados.</strong>
          <span>Hay {Object.keys(errors).length} {Object.keys(errors).length === 1 ? 'campo pendiente' : 'campos pendientes'}.</span>
        </div>
      )}

      <div className="form-grid">
        <div className="field field-wide">
          <label htmlFor="fullName">Nombre completo <span aria-hidden="true">*</span></label>
          <input id="fullName" data-control-id="fullName" value={data.fullName} onChange={(e) => update('fullName', e.target.value)} aria-invalid={!!errors.fullName} aria-describedby={describedBy('fullName')} autoComplete="name" />
          {errors.fullName && <span className="field-error" id="fullName-error">{errors.fullName}</span>}
        </div>

        <div className="field">
          <label htmlFor="email">Correo electrónico <span aria-hidden="true">*</span></label>
          <input className={isBarrierMode ? 'focus-hidden' : ''} id="email" data-control-id="email" type="email" value={data.email} onChange={(e) => update('email', e.target.value)} aria-invalid={!!errors.email} aria-describedby={describedBy('email')} autoComplete="email" />
          {errors.email && <span className="field-error" id="email-error">{errors.email}</span>}
        </div>

        <div className="field">
          <label htmlFor="identification">Número de identificación <span aria-hidden="true">*</span></label>
          <input id="identification" data-control-id="identification" value={data.identification} onChange={(e) => update('identification', e.target.value)} aria-invalid={!!errors.identification} aria-describedby={describedBy('identification')} />
          {errors.identification && <span className="field-error" id="identification-error">{errors.identification}</span>}
        </div>

        <div className="field field-wide">
          <label htmlFor="career">Carrera universitaria <span aria-hidden="true">*</span></label>
          <select id="career" data-control-id="career" tabIndex={isBarrierMode ? 2 : undefined} value={data.career} onChange={(e) => update('career', e.target.value)} aria-invalid={!!errors.career} aria-describedby={describedBy('career')}>
            <option value="">Seleccioná una carrera</option>
            <option>Ingeniería de Sistemas</option>
            <option>Diseño Gráfico</option>
            <option>Administración</option>
            <option>Comunicación Social</option>
          </select>
          {errors.career && <span className="field-error" id="career-error">{errors.career}</span>}
        </div>

        <fieldset className="choice-group">
          <legend>Modalidad <span aria-hidden="true">*</span></legend>
          <div className="choices">
            {['Presencial', 'Virtual'].map((option) => (
              <label key={option}><input data-control-id={`modality-${option}`} type="radio" name="modality" checked={data.modality === option} onChange={() => update('modality', option)} aria-invalid={!!errors.modality} aria-describedby={errors.modality ? 'modality-error' : undefined} /> {option}</label>
            ))}
          </div>
          {errors.modality && <span className="field-error" id="modality-error">{errors.modality}</span>}
        </fieldset>

        <fieldset className="choice-group">
          <legend>Intereses académicos</legend>
          <div className="choices choices-column">
            {['Programación', 'Diseño UX/UI', 'Inteligencia Artificial'].map((interest) => (
              <label key={interest}>
                <input
                  data-control-id={`interest-${interest}`}
                  type="checkbox"
                  checked={data.interests.includes(interest)}
                  onChange={(e) => update('interests', e.target.checked ? [...data.interests, interest] : data.interests.filter((item) => item !== interest))}
                /> {interest}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="field">
          <label htmlFor="participationDate">Fecha de participación <span aria-hidden="true">*</span></label>
          <input id="participationDate" data-control-id="participationDate" type="date" tabIndex={isBarrierMode ? -1 : undefined} value={data.participationDate} onChange={(e) => update('participationDate', e.target.value)} aria-invalid={!!errors.participationDate} aria-describedby={describedBy('participationDate')} />
          {errors.participationDate && <span className="field-error" id="participationDate-error">{errors.participationDate}</span>}
        </div>

        <div className="field field-wide">
          <label htmlFor="comments">Comentarios adicionales</label>
          <textarea className={isBarrierMode ? 'focus-hidden' : ''} id="comments" data-control-id="comments" rows={4} value={data.comments} onChange={(e) => update('comments', e.target.value)} />
        </div>
      </div>

      <div className="terms-block">
        {isBarrierMode ? (
          <div
            className="fake-checkbox-label"
            role="checkbox"
            aria-checked={data.accepted}
            tabIndex={0}
            data-control-id="accepted"
            onClick={() => update('accepted', !data.accepted)}
          >
            <span className="fake-checkbox" aria-hidden="true">{data.accepted ? '✓' : ''}</span>
            Acepto las condiciones de participación <span aria-hidden="true">*</span>
          </div>
        ) : (
          <label className="terms-label">
            <input data-control-id="accepted" type="checkbox" checked={data.accepted} onChange={(e) => update('accepted', e.target.checked)} aria-invalid={!!errors.accepted} aria-describedby={describedBy('accepted')} />
            Acepto las condiciones de participación <span aria-hidden="true">*</span>
          </label>
        )}
        {errors.accepted && <span className="field-error" id="accepted-error">{errors.accepted}</span>}
      </div>

      <div className="form-actions">
        {isBarrierMode ? (
          <div className="button button-primary fake-submit" role="button" tabIndex={0} data-control-id="submit" onClick={() => submit()}>
            Enviar inscripción
          </div>
        ) : (
          <button className="button button-primary" data-control-id="submit" type="submit">Enviar inscripción</button>
        )}
        <button className="button button-secondary" data-control-id="clear" type="button" onClick={() => { onChange({ fullName: '', email: '', identification: '', career: '', modality: '', interests: [], participationDate: '', comments: '', accepted: false }); setErrors({}) }}>
          Limpiar formulario
        </button>
      </div>
    </form>
  )
}
