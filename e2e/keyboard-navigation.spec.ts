import { expect, test } from '@playwright/test'

async function openChallenge(page: import('@playwright/test').Page, mode: 'barriers' | 'accessible') {
  await page.goto('/')
  const challenge = page.getByRole('article').filter({ hasText: 'Reto A · Sin mouse' })
  await challenge.getByRole('button', { name: 'Iniciar reto' }).click()
  await page.getByLabel('Nombre del estudiante').fill('Ana Torres')
  await page.getByLabel(mode === 'barriers' ? /Modo A/ : /Modo B/).check()
  await page.getByRole('button', { name: /Comenzar prueba/ }).click()
}

test('accessible mode supports Tab, Shift+Tab, Space and Enter', async ({ page }) => {
  await openChallenge(page, 'accessible')

  const name = page.getByLabel(/Nombre completo/)
  const email = page.getByLabel(/Correo electrónico/)
  await name.focus()
  await page.keyboard.press('Tab')
  await expect(email).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(name).toBeFocused()

  await name.fill('Ana Torres')
  await email.fill('ana@example.com')
  await page.getByLabel(/Número de identificación/).fill('2026001')
  await page.getByLabel(/Carrera universitaria/).selectOption('Diseño Gráfico')
  await page.getByLabel('Virtual').check()
  await page.getByLabel(/Fecha de participación/).fill('2026-11-10')

  const terms = page.getByRole('checkbox', { name: /Acepto las condiciones/ })
  await terms.focus()
  await page.keyboard.press('Space')
  await expect(terms).toBeChecked()

  await page.getByRole('button', { name: 'Enviar inscripción' }).focus()
  await page.keyboard.press('Enter')
  await expect(page.getByText('Inscripción enviada.')).toBeVisible()
})

test('barrier mode exposes its real keyboard defects without trapping focus', async ({ page }) => {
  await openChallenge(page, 'barriers')

  await page.getByLabel(/Nombre completo/).focus()
  await page.keyboard.press('Tab')
  await expect(page.getByLabel(/Correo electrónico/)).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByLabel(/Número de identificación/)).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByLabel('Presencial')).toBeFocused()
  await expect(page.getByLabel(/Fecha de participación/)).toHaveAttribute('tabindex', '-1')

  const terms = page.getByRole('checkbox', { name: /Acepto las condiciones/ })
  await terms.focus()
  await page.keyboard.press('Space')
  await expect(terms).toHaveAttribute('aria-checked', 'false')

  await page.getByRole('button', { name: 'Enviar inscripción' }).focus()
  await page.keyboard.press('Enter')
  await expect(page.getByText('Inscripción enviada.')).toHaveCount(0)

  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'Limpiar formulario' })).toBeFocused()
})
