import { test } from '@playwright/test';
import { PersistenceEditor } from '../page-objects/PersistenceEditor';
import { screenshot } from './screenshot-util';

test('editor', async ({ page }) => {
  const editor = await PersistenceEditor.openMock(page);
  await editor.main.table.row(0).locator.click();
  await screenshot(page, 'persistence-editor');
});
