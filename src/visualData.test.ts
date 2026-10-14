import { describe, expect, it } from 'vitest'
import { countVisualActivities, isActivityCorrect } from './visualData'
import { emptyVisualActivities } from './types'

describe('visual activity verification', () => {
  it('accepts the explicit portal answers without requiring exact punctuation', () => {
    expect(isActivityCorrect('deadline', '18 de noviembre de 2026')).toBe(true)
    expect(isActivityCorrect('contrast', 'Sirve para actualizar los datos del perfil')).toBe(true)
    expect(isActivityCorrect('statuses', 'Diseño de Interacción aprobada; Interfaces pendiente; Comunicación rechazada')).toBe(true)
    expect(isActivityCorrect('error', 'El correo no coincide y es inválido')).toBe(true)
    expect(isActivityCorrect('smallText', 'El promedio es 4,2')).toBe(true)
  })

  it('separates completed, unable and correct activities', () => {
    const activities = {
      ...emptyVisualActivities,
      deadline: { answer: '18/11/2026', status: 'completed' as const },
      contrast: { answer: '', status: 'unable' as const },
      error: { answer: 'Otra respuesta', status: 'completed' as const },
    }
    expect(countVisualActivities(activities)).toEqual({ completed: 2, unable: 1, correct: 1 })
  })
})
