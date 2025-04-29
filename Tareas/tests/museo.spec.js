import { test, expect } from '@playwright/test'

test('La página principal carga correctamente', async ({ page }) => {
    await page.goto('http://localhost:8000')
    await expect(page.getByText('Museo Arqueológico de Granada')).toBeVisible()
})

test('Busco oro', async ({ page }) => {
    await page.goto('http://localhost:8000/obras/buscar?búsqueda=oro');
    await expect(page.locator('p.title', { hasText: 'Reproducción de diadema' })).toBeVisible();
});

