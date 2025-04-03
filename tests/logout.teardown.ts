
import { test as setup, expect } from '@playwright/test';

setup('logout', async ({ page }) => {
	await page.goto('http://localhost:4173/');
	await page.getByRole('button', { name: 'Log out' }).click();
});
