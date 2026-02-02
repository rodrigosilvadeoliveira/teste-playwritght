import { test, expect } from '@playwright/test'

test('acessar google', async ({ page }) => {

    await page.goto('http://google.com')
    // await expect(page).toHaveTitle('Gerencie suas tarefas com Mark L')//Titulo da pagina nop header
     await page.waitForTimeout(2000)

})