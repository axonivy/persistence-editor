import { expect, type Locator, type Page } from '@playwright/test';

import { AddPersistenceDialog } from './AddPersistenceDialog';
import { Table } from './components/Table';

export class Main {
  readonly locator: Locator;
  readonly add: Locator;
  readonly delete: Locator;
  readonly search: Locator;
  readonly table: Table;

  constructor(readonly page: Page) {
    this.locator = page.locator('.persistence-editor-main-content');
    this.add = this.locator.getByRole('button', { name: 'Add Persistence' });
    this.delete = this.locator.getByRole('button', { name: 'Delete Persistence' });
    this.search = this.locator.getByRole('textbox').first();
    this.table = new Table(page, this.locator);
  }

  public async openAddPersistenceDialog() {
    await this.add.click();
    const dialog = new AddPersistenceDialog(this.page);
    await expect(dialog.locator).toBeVisible();
    return dialog;
  }
}
