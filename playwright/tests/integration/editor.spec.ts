import { expect, test } from '@playwright/test';
import { AddPersistenceDialog } from '../page-objects/AddPersistenceDialog';
import { PersistenceEditor } from '../page-objects/PersistenceEditor';

test('data', async () => {
  //tbd
});

test('save data', async () => {
  //tbd
});

test('select persistence', async ({ page }) => {
  const editor = await PersistenceEditor.openMock(page);
  await editor.main.table.expectToHaveNoSelection();
  await expect(editor.detail.header).toHaveText('Persistence');

  await editor.main.table.row(0).locator.click();
  await expect(editor.detail.header).toHaveText('league');

  await editor.main.table.header(0).locator.click();
  await editor.main.table.expectToHaveNoSelection();
  await expect(editor.detail.header).toHaveText('Persistence');
});

test('search', async ({ page }) => {
  const editor = await PersistenceEditor.openMock(page);
  await editor.main.table.expectToHaveRowCount(3);
  await editor.main.search.fill('l');
  await editor.main.table.expectToHaveRowCount(1);
});

test('sort', async ({ page }) => {
  const editor = await PersistenceEditor.openMock(page);
  await editor.main.table.expectToHaveRows(['League Persistence Unit', 'LeagueDB']);
  await editor.main.table.header(0).locator.getByRole('button', { name: 'Sort by Name' }).click();
  await editor.main.table.expectToHaveRows(['Audit Persistence Unit', 'AuditDB']);
});

test('add', async ({ page }) => {
  const editor = await PersistenceEditor.openMock(page);
  await editor.main.table.expectToHaveRowCount(3);
  const dialog = await editor.main.openAddPersistenceDialog();
  await dialog.name.locator.fill('NewPersistence');
  await dialog.cancel.click();
  await editor.main.table.expectToHaveRowCount(3);

  await editor.main.openAddPersistenceDialog();
  await dialog.name.locator.fill('NewPersistence');
  await dialog.dataSource.locator.fill('SomeOtherDB');
  await dialog.create.click();
  await editor.main.table.expectToHaveRowCount(4);
  await editor.main.table.row(3).expectToHaveColumns('NewPersistence', 'SomeOtherDB');
  await editor.main.table.row(3).expectToBeSelected();
  await editor.main.delete.click();
  await editor.main.table.expectToHaveRowCount(3);
});

test('empty', async ({ page }) => {
  const editor = await PersistenceEditor.openMock(page);
  await editor.main.table.clear();
  await expect(editor.main.locator).toBeHidden();
  const mainPanel = page.locator('.persistence-editor-main-panel');
  const emptyMessage = mainPanel.locator('.ui-panel-message');
  await expect(emptyMessage).toBeVisible();

  await mainPanel.locator('button', { hasText: 'Add Persistence' }).click();
  const dialog = new AddPersistenceDialog(page);
  await expect(dialog.locator).toBeVisible();
  await dialog.cancel.click();
  await expect(dialog.locator).toBeHidden();

  await page.keyboard.press('a');
  await expect(dialog.locator).toBeVisible();
});
