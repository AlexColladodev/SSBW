import { test, expect } from '@playwright/test'

test('La página principal carga correctamente', async ({ page }) => {
    await page.goto('http://localhost:8000');
    await expect(page.getByRole('heading', { name: 'Museo Arqueológico de Granada', level: 1 })).toBeVisible();
});

test('Busco oro', async ({ page }) => {
    await page.goto('http://localhost:8000/obras/buscar?búsqueda=oro');
    await expect(page.locator('p.title', { hasText: 'Reproducción de diadema' })).toBeVisible();
});

test('Login correcto', async ({ page }) => {
    await page.goto('http://localhost:8000/usuarios/login');

    await page.fill('input[name="correo"]', 'colladoalexander252@gmail.com');
    await page.fill('input[name="password"]', '123456');

    // Clic en el botón con id="login"
    await page.click('#login');

    // Espera a que la URL cambie a la principal
    await page.waitForURL('http://localhost:8000/');

    // Comprueba que el botón de "Cerrar Sesión" esté visible
    await expect(page.locator('a.button.is-light', { hasText: 'Cerrar Sesión' })).toBeVisible();
});
