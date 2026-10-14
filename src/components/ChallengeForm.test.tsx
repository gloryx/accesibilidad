import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { ChallengeForm } from './ChallengeForm'
import { emptyChallenge, type ChallengeData, type Mode } from '../types'

const validChallenge: ChallengeData = {
  fullName: 'Ana Torres',
  email: 'ana@example.com',
  identification: '2026001',
  career: 'Diseño Gráfico',
  modality: 'Virtual',
  interests: ['Diseño UX/UI'],
  participationDate: '2026-11-10',
  comments: '',
  accepted: true,
}

function Harness({ mode, initial = emptyChallenge, onSubmitted = () => undefined }: { mode: Mode; initial?: ChallengeData; onSubmitted?: () => void }) {
  const [data, setData] = useState(initial)
  return <ChallengeForm mode={mode} data={data} onChange={setData} onSubmitted={onSubmitted} onControlFocus={() => undefined} />
}

describe('ChallengeForm keyboard behavior', () => {
  it('keeps the accessible mode in visual DOM order and reaches the date with Tab', async () => {
    const user = userEvent.setup()
    render(<Harness mode="accessible" />)

    await user.tab()
    expect(screen.getByLabelText(/Nombre completo/)).toHaveFocus()
    await user.tab()
    expect(screen.getByLabelText(/Correo electrónico/)).toHaveFocus()
    await user.tab()
    expect(screen.getByLabelText(/Número de identificación/)).toHaveFocus()
    await user.tab()
    expect(screen.getByLabelText(/Carrera universitaria/)).toHaveFocus()

    let reachedDate = false
    for (let index = 0; index < 10; index += 1) {
      await user.tab()
      if (screen.getByLabelText(/Fecha de participación/) === document.activeElement) reachedDate = true
    }
    expect(reachedDate).toBe(true)
  })

  it('moves the positive-tabindex career control first and skips the date in barrier mode', async () => {
    const user = userEvent.setup()
    render(<Harness mode="barriers" />)

    await user.tab()
    expect(screen.getByLabelText(/Carrera universitaria/)).toHaveFocus()

    const visited: Element[] = [document.activeElement!]
    for (let index = 0; index < 14; index += 1) {
      await user.tab()
      visited.push(document.activeElement!)
    }
    expect(visited).not.toContain(screen.getByLabelText(/Fecha de participación/))
  })

  it('toggles the native accessible checkbox with Space', async () => {
    const user = userEvent.setup()
    render(<Harness mode="accessible" />)
    const terms = screen.getByRole('checkbox', { name: /Acepto las condiciones/ })

    terms.focus()
    await user.keyboard(' ')

    expect(terms).toBeChecked()
  })

  it('does not toggle the custom barrier checkbox with Space', async () => {
    const user = userEvent.setup()
    render(<Harness mode="barriers" />)
    const terms = screen.getByRole('checkbox', { name: /Acepto las condiciones/ })

    terms.focus()
    await user.keyboard(' ')

    expect(terms).toHaveAttribute('aria-checked', 'false')
  })

  it('submits accessible mode with Enter but not the custom barrier button', async () => {
    const user = userEvent.setup()
    const accessibleSubmit = vi.fn()
    const { unmount } = render(<Harness mode="accessible" initial={validChallenge} onSubmitted={accessibleSubmit} />)

    screen.getByRole('button', { name: 'Enviar inscripción' }).focus()
    await user.keyboard('{Enter}')
    expect(accessibleSubmit).toHaveBeenCalledOnce()

    unmount()
    const barrierSubmit = vi.fn()
    render(<Harness mode="barriers" initial={validChallenge} onSubmitted={barrierSubmit} />)
    screen.getByRole('button', { name: 'Enviar inscripción' }).focus()
    await user.keyboard('{Enter}')
    expect(barrierSubmit).not.toHaveBeenCalled()
  })

  it('supports reverse navigation with Shift+Tab in accessible mode', async () => {
    const user = userEvent.setup()
    render(<Harness mode="accessible" />)
    screen.getByLabelText(/Correo electrónico/).focus()

    await user.tab({ shift: true })

    expect(screen.getByLabelText(/Nombre completo/)).toHaveFocus()
  })
})
