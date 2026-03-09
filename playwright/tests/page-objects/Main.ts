import { expect, type Locator, type Page } from '@playwright/test';

import { AddPersistenceDialog } from './AddPersistenceDialog';
import { Table } from './components/Table';
import { SchemaGenerateDialog } from './SchemaGenerateDialog';

export class Main {
  readonly locator: Locator;
  readonly add: Locator;
  readonly generate: Locator;
  readonly delete: Locator;
  readonly search: Locator;
  readonly table: Table;

  constructor(readonly page: Page) {
    this.locator = page.locator('#persistence-editor-main');
    this.add = this.locator.getByRole('button', { name: 'Add Persistence Unit' });
    this.generate = this.locator.getByRole('button', { name: 'Generate Schema' });
    this.delete = this.locator.getByRole('button', { name: 'Delete Persistence Unit' });
    this.search = this.locator.getByRole('textbox').first();
    this.table = new Table(page, this.locator);
  }

  public async openAddPersistenceDialog() {
    await this.add.click();
    const dialog = new AddPersistenceDialog(this.page);
    await expect(dialog.locator).toBeVisible();
    return dialog;
  }

  public async openSchemaGenerateDialog(rowNth: number) {
    await expect(this.generate).toBeDisabled();
    await this.table.row(rowNth).locator.click();
    await expect(this.generate).toBeEnabled();
    await this.generate.click();
    const dialog = new SchemaGenerateDialog(this.page);
    await expect(dialog.locator).toBeVisible();
    return dialog;
  }
}
