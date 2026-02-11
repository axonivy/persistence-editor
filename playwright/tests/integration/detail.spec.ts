import { expect, test } from '@playwright/test';
import { PersistenceEditor } from '../page-objects/PersistenceEditor';

test('empty', async ({ page }) => {
  const editor = await PersistenceEditor.openMock(page);
  await expect(editor.detail.header).toHaveText('Persistence');
  await expect(editor.detail.content).toBeHidden();
  const emptyMessage = editor.detail.locator.locator('.ui-panel-message');
  await expect(emptyMessage).toBeVisible();
  await expect(emptyMessage).toHaveText('No Persistence Selected');
});

test('edit persistence', async ({ page }) => {
  const editor = await PersistenceEditor.openMock(page);
  await editor.main.table.row(0).locator.click();
  await expect(editor.detail.header).toHaveText('league');
  await expect(editor.detail.content).toBeVisible();

  await expect(editor.detail.name.locator).toHaveValue('League Persistence Unit');
  await expect(editor.detail.dataSource.locator).toHaveValue('LeagueDB');

  await editor.detail.name.locator.fill('Updated Persistence Unit');
  await editor.detail.dataSource.locator.fill('Updated LeagueDB');
  await page.keyboard.press('Escape');
  await editor.main.table.row(0).expectToHaveColumns('Updated Persistence Unit', 'Updated LeagueDB');
});
