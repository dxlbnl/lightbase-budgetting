import { test, expect } from '@playwright/test';

test('login', async ({ page }) => {
	await page.goto('http://localhost:4173/');

	await page.getByRole('textbox').click();
	await page.getByRole('textbox').fill('arthur');
	await page.getByRole('textbox').press('Enter');

	await expect(page.getByText('Logged in as Arthur')).toBeVisible();

	await page.context().storageState({ path:  './playwright/.auth/user.json' });
});
