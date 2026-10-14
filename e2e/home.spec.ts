import { expect, test } from '@playwright/test'

test('teacher information remains visible on desktop and mobile', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Laboratorio de Accesibilidad Web' })).toBeVisible()
  await expect(page.getByText('Docente responsable')).toBeVisible()
  await expect(page.getByText('Ing. Gloriana Peña Ramírez')).toBeVisible()

  await page.setViewportSize({ width: 375, height: 667 })

  await expect(page.getByText('Ing. Gloriana Peña Ramírez')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Reto A · Sin mouse' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Reto B · Condiciones visuales difíciles' })).toBeVisible()
})
