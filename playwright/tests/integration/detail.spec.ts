import { expect, test } from '@playwright/test';
import { PersistenceEditor } from '../page-objects/PersistenceEditor';

test('empty', async ({ page }) => {
  const editor = await PersistenceEditor.openMock(page);
  await expect(editor.detail.header).toHaveText('Persistence Unit');
  await expect(editor.detail.locator.locator('.ui-panel-message')).toHaveText('No Persistence Unit Selected');
});

test('edit persistence', async ({ page }) => {
  const editor = await PersistenceEditor.openMock(page);
  await editor.main.table.row(0).locator.click();
  await expect(editor.detail.header).toHaveText('League Persistence Unit');

  await expect(editor.detail.name.locator).toHaveValue('League Persistence Unit');
  await expect(editor.detail.dataSource.locator).toHaveText('LeagueDB');
  await expect(editor.detail.description.locator).toHaveValue('Persistence unit for league data');
  await editor.detail.manageAllEntityClasses.expectValue(true);
  await editor.detail.managedClasses.expectToHaveValue('com.example.league.Team,com.example.league.Player,com.example.league.Match');
  await editor.detail.properties.expectToHaveRowValues(['hibernate.hbm2ddl.auto', 'update']);

  await editor.detail.name.locator.fill('Updated Persistence Unit');
  await editor.detail.description.locator.fill('Updated Description');
  await editor.detail.dataSource.select('FinanceDB');
  await editor.detail.manageAllEntityClasses.toggle();
  await editor.detail.managedClasses.select('com.acme.bank.payment.Payment');
  const row = await editor.detail.properties.addRow();
  await row.fill(['newProp', 'newValue']);
  await page.keyboard.press('Escape');
  await editor.main.table.row(0).expectToHaveColumns('Updated Persistence Unit', 'FinanceDB');

  await editor.main.table.row(0).locator.click();
  await expect(editor.detail.name.locator).toHaveValue('Updated Persistence Unit');
  await expect(editor.detail.description.locator).toHaveValue('Updated Description');
  await expect(editor.detail.dataSource.locator).toHaveText('FinanceDB');
  await editor.detail.managedClasses.expectToHaveValue('com.example.league.Team,com.example.league.Player,com.example.league.Match,com.acme.bank.payment.Payment');
  await editor.detail.manageAllEntityClasses.expectValue(false);
  await editor.detail.properties.expectToHaveRowValues(['hibernate.hbm2ddl.auto', 'update'], ['newProp', 'newValue']);
});
