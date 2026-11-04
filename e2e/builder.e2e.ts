import { expect, test } from '@playwright/test';

test('previews what is typed', async ({ page }) => {
	await page.goto('/raster');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('RASTER');

	await page.getByLabel('Title', { exact: true }).fill('Hello');
	await page.getByRole('combobox', { name: /^Template/ }).selectOption('aurora');
	await page.getByRole('combobox', { name: /^Format/ }).selectOption('square');

	const preview = page.getByAltText('Preview of the generated header');
	await expect(preview).toHaveAttribute('src', /title=Hello/);
	await expect(preview).toHaveAttribute('src', /template=aurora/);
	await expect(preview).toHaveAttribute('src', /format=square/);
	await expect
		.poll(() => preview.evaluate((image: HTMLImageElement) => image.naturalWidth))
		.toBe(1200);
});

test('gives Markdown to paste', async ({ page }) => {
	await page.goto('/raster');
	await page.getByLabel('Title', { exact: true }).fill('Hello');

	await expect(page.locator('code')).toContainText('![Hello](http://localhost:4173/raster/header?');
});

test('keeps badges in the URL', async ({ page }) => {
	await page.goto('/raster');
	await page.getByLabel('Badge URLs').fill('https://img.shields.io/badge/a-b-green');

	await expect(page.locator('code')).toContainText('badge=https%3A%2F%2Fimg.shields.io');
});
