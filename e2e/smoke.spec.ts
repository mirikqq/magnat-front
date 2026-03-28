import { test, expect } from '@playwright/test';

test('needed page opens', async ({ page }) => {
  await page.goto('/needed');
  await expect(page.getByRole('heading', { name: 'Потребность' })).toBeVisible();
});
