import { test } from '@playwright/test';
import { PersistenceEditor } from '../page-objects/PersistenceEditor';
import { screenshot, screenshotElement } from './screenshot-util';

test('editor', async ({ page }) => {
  const editor = await PersistenceEditor.openMock(page);
  await editor.main.table.row(0).locator.click();
  await screenshot(page, 'persistence-editor');
});

test('schema generation', async ({ page }) => {
  const editor = await PersistenceEditor.openMock(page);
  const dialog = await editor.main.openSchemaGenerateDialog(0);
  await dialog.type.select('Create');
  await screenshotElement(dialog.locator, 'schema-generation-dialog');
});
