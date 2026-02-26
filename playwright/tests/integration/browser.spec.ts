import { expect, test } from '@playwright/test';
import { Browser } from '../page-objects/Browser';
import { PersistenceEditor } from '../page-objects/PersistenceEditor';

test('properties', async ({ page }) => {
  const editor = await PersistenceEditor.openPersistence(page);
  await editor.main.table.row(0).locator.click();
  await expect(editor.detail.header).toHaveText('CoreBusinessPU');
  await editor.detail.properties.row(0).expectToHaveColumnValues('hibernate.hbm2ddl.auto', 'create-drop');
  await editor.detail.properties.row(0).column(0).locator.click();
  await editor.detail.properties.locator.getByRole('button', { name: 'Browser' }).click();
  const browser = new Browser(page);
  await expect(browser.view).toBeVisible();
  await expect(browser.view.getByRole('textbox')).toHaveValue('hibernate.hbm2ddl.auto');
  await browser.table.expectToHaveRowCount(1);
  await browser.table.expectToHaveRows(['hibernate.hbm2ddl.autoControls the Hibernate database schema generation process']);

  await browser.table.row(0).locator.click();
  await browser.info.open();
  await expect(browser.info.content).toHaveText(
    'InfoControls the Hibernate database schema generation processDefault Value: noneExamples: none, create, create-drop, validate, update'
  );

  await browser.view.getByRole('textbox').clear();
  await browser.table.expectToHaveRowCount(11);

  await browser.table.row(0).locator.click();
  await expect(browser.info.content).toHaveText('InfoDefault database schema to use for unqualified table namesExamples: dbo');
});

test('properties apply', async ({ page }) => {
  const editor = await PersistenceEditor.openMock(page);
  await editor.main.table.row(0).locator.click();
  await expect(editor.detail.header).toHaveText('League Persistence Unit');
  await editor.detail.properties.row(0).expectToHaveColumnValues('hibernate.hbm2ddl.auto', 'update');
  await editor.detail.properties.row(0).column(0).locator.click();
  await editor.detail.properties.locator.getByRole('button', { name: 'Browser' }).click();
  const browser = new Browser(page);
  await expect(browser.view).toBeVisible();
  await browser.view.getByRole('textbox').clear();
  await browser.table.expectToHaveRowCount(2);
  await browser.table.row(1).locator.click();
  await browser.view.getByRole('button', { name: 'Apply' }).click();
  await editor.detail.properties.row(0).expectToHaveColumnValues('hibernate.dialect', 'update');
});
