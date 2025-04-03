import { test, expect } from '@playwright/test';



test('Showing available budgets', async ({ page }) => {
  await page.goto('http://localhost:4173/');

  await page.getByRole('textbox').click();
  await page.getByRole('textbox').fill('arthur');
  await page.getByRole('textbox').press('Enter');


  // Expect a title "to contain" a substring.
  await expect(page.getByRole('heading', {name: 'Lightbase budgets'})).toBeVisible();

  await expect(page.getByRole('listitem')).toHaveText([
    'Budget € 100.00 (valid: 2025-01-01 - 2025-12-31)'
  ]);

});
test('Register purchases', async ({ page }) => {
  await page.goto('http://localhost:4173/');

  await page.getByRole('spinbutton', { name: 'Amount:' }).fill('72');
  await page.getByRole('spinbutton', { name: 'Amount:' }).press('Tab');
  await page.getByRole('textbox', { name: 'Description:' }).fill('First purchase');
  await page.getByRole('textbox', { name: 'Description:' }).press('Enter');

  await expect(page.getByRole('listitem')).toHaveText([
    'Budget € 28.00 (valid: 2025-01-01 - 2025-12-31)'
  ]);

  await page.getByRole('spinbutton', { name: 'Amount:' }).fill('28');
  await page.getByRole('spinbutton', { name: 'Amount:' }).press('Tab');
  await page.getByRole('textbox', { name: 'Description:' }).fill('First purchase');
  await page.getByRole('textbox', { name: 'Description:' }).press('Enter');

  await expect(page.getByText('Sadly there\'s no budget')).toBeVisible()
});
