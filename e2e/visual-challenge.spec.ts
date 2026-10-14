import { expect, test, type Page } from '@playwright/test'

async function openVisualChallenge(page: Page, mode: 'barriers' | 'accessible' = 'barriers') {
  await page.goto('/')
  const challenge = page.getByRole('article').filter({ hasText: 'Reto B · Condiciones visuales difíciles' })
  await challenge.getByRole('button', { name: 'Iniciar reto' }).click()
  await page.getByLabel('Nombre del estudiante').fill('Lucía Méndez')
  await page.getByLabel(mode === 'barriers' ? /Modo A/ : /Modo B/).check()
  await page.getByRole('button', { name: /Comenzar prueba/ }).click()
}

test('visual challenge records simulations, activities, feedback and PDF', async ({ page }) => {
  await openVisualChallenge(page)

  const portal = page.getByLabel('Portal de Servicios Estudiantiles')
  await page.getByLabel('Brillo reducido').fill('3')
  await page.getByLabel('Intenso').check()
  await page.getByLabel('200%').check()
  await expect(portal).toHaveClass(/portal-problem/)
  await expect(portal).toHaveClass(/text-200/)
  await expect(page.locator('.glare-overlay')).toBeVisible()

  const answers = [
    ['Actividad 1', '18/11/2026'],
    ['Actividad 2', 'Actualizar datos'],
    ['Actividad 3', 'Diseño de Interacción aprobada; Interfaces Humano-Computador pendiente; Comunicación Visual rechazada'],
    ['Actividad 4', 'Correo institucional inválido'],
    ['Actividad 5', 'Promedio acumulado 4,2'],
  ] as const

  for (const [title, answer] of answers) {
    const activity = page.getByRole('article').filter({ hasText: title })
    await activity.getByRole('textbox').fill(answer)
    await activity.getByRole('button', { name: 'Marcar completada' }).click()
  }
  await expect(page.getByText('5/5')).toBeVisible()
  await page.getByRole('button', { name: 'Finalizar prueba' }).click()

  await page.getByLabel('Problemas encontrados').fill('Textos pequeños, bajo contraste y estados comunicados sólo con color.')
  await page.getByLabel(/Qué cambios mejorarían/).fill('Aumentar contraste, tamaño y agregar etiquetas a los estados.')
  await page.getByRole('button', { name: /Generar reporte/ }).click()

  await expect(page.getByRole('heading', { name: 'Reporte de accesibilidad visual' })).toBeVisible()
  await expect(page.getByText('5 completadas · 0 no completadas')).toBeVisible()
  await expect(page.getByText(/Texto: 100%, 200%/)).toBeVisible()
  await expect(page.getByText(/Brillo: Normal, Intensa/)).toBeVisible()

  await page.getByRole('button', { name: 'Ver soluciones y explicación' }).click()
  await expect(page.getByRole('heading', { name: 'Soluciones y criterios WCAG 2.2' })).toBeVisible()
  await expect(page.getByText('Respuesta coincidente')).toHaveCount(5)
  await expect(page.getByLabel(/Vista corregida del Portal/)).toHaveClass(/portal-accessible/)

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Exportar reporte a PDF' }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toMatch(/reporte-accesibilidad-lucía-méndez\.pdf/)

  await page.getByRole('navigation', { name: 'Navegación principal' }).getByRole('button', { name: 'Mis resultados' }).click()
  await expect(page.getByRole('heading', { name: 'Mis resultados' })).toBeVisible()
  await expect(page.getByRole('article').filter({ hasText: 'Condiciones visuales difíciles' })).toContainText('Lucía Méndez')
})

test('accessible visual mode exposes text labels and reflows at 200 percent', async ({ page }) => {
  await openVisualChallenge(page, 'accessible')
  await page.getByLabel('200%').check()

  const portal = page.getByLabel('Portal de Servicios Estudiantiles')
  await expect(portal).toHaveClass(/portal-accessible/)
  await expect(portal.getByText('Aprobada')).toBeVisible()
  await expect(portal.getByText('Pendiente')).toBeVisible()
  await expect(portal.getByText('Rechazada')).toBeVisible()
  await expect(portal.locator('tbody')).toHaveCSS('display', 'grid')
})

test('student can mark an activity as unreadable and still finish', async ({ page }) => {
  await openVisualChallenge(page)
  const firstActivity = page.getByRole('article').filter({ hasText: 'Actividad 1' })
  await firstActivity.getByRole('button', { name: 'No pude completarla' }).click()
  await expect(firstActivity.getByRole('textbox')).toBeDisabled()
  await page.getByRole('button', { name: 'Finalizar prueba' }).click()
  await expect(page.getByRole('heading', { name: 'Evaluá lo que percibiste' })).toBeVisible()
})
