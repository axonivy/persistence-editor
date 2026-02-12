import { expect, test } from '@playwright/test';
import { AddPersistenceDialog } from '../page-objects/AddPersistenceDialog';
import { PersistenceEditor } from '../page-objects/PersistenceEditor';

test('data', async ({ page }) => {
  const editor = await PersistenceEditor.openPersistence(page);
  await expect(editor.main.locator.getByText('Persistence Units').first()).toBeVisible();
  await editor.main.table.header(0).locator.getByRole('button', { name: 'Sort by Name' }).click();
  await editor.main.table.expectToHaveRows(['CoreBusinessPU', 'CoreDB'], ['ReportingPU', 'ReportingDB']);
  await editor.main.table.row(0).locator.click();
  await expect(editor.detail.header).toHaveText('CoreBusinessPU');

  await expect(editor.detail.name.locator).toHaveValue('CoreBusinessPU');
  await expect(editor.detail.dataSource.locator).toHaveText('CoreDB');
  await expect(editor.detail.description.locator).toHaveValue('Primary transactional database for core business operations');
  await editor.detail.excludeUnlistedClasses.expectValue(false);
  await editor.detail.managedClasses.expectToHaveValue('');
  await editor.detail.properties.expectToHaveRowValues(['hibernate.hbm2ddl.auto', 'create-drop'], ['hibernate.dialect', 'org.hibernate.dialect.H2Dialect']);
});

test('save data', async ({ page, browserName }, testInfo) => {
  const editor = await PersistenceEditor.openPersistence(page);
  const dialog = await editor.main.openAddPersistenceDialog();
  const newPersistenceUnit = `${browserName}-${testInfo.retry}-PU`;
  await dialog.name.locator.fill(newPersistenceUnit);
  await dialog.create.click();
  const row = editor.main.table.lastRow();
  await row.expectToHaveColumns(newPersistenceUnit, '');

  await row.locator.click();
  await expect(editor.detail.header).toHaveText(newPersistenceUnit);
  await editor.detail.description.locator.fill('some description');
  await editor.detail.dataSource.select('ReportingDB');
  await row.expectToHaveColumns(newPersistenceUnit, 'ReportingDB');

  await page.reload();
  await row.expectToHaveColumns(newPersistenceUnit, 'ReportingDB');

  await row.locator.click();
  await editor.main.delete.click();
  await expect(row.column(0).locator).not.toHaveText(newPersistenceUnit);
});

test('select persistence', async ({ page }) => {
  const editor = await PersistenceEditor.openMock(page);
  await editor.main.table.expectToHaveNoSelection();
  await expect(editor.detail.header).toHaveText('Persistence Unit');

  await editor.main.table.row(0).locator.click();
  await expect(editor.detail.header).toHaveText('League Persistence Unit');

  await editor.main.table.header(0).locator.click();
  await editor.main.table.expectToHaveNoSelection();
  await expect(editor.detail.header).toHaveText('Persistence Unit');
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
  await dialog.create.click();
  await editor.main.table.expectToHaveRowCount(4);
  await editor.main.table.row(3).expectToHaveColumns('NewPersistence', '');
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

  await mainPanel.locator('button', { hasText: 'Add Persistence Unit' }).click();
  const dialog = new AddPersistenceDialog(page);
  await expect(dialog.locator).toBeVisible();
  await dialog.cancel.click();
  await expect(dialog.locator).toBeHidden();

  await page.keyboard.press('a');
  await expect(dialog.locator).toBeVisible();
});
