import { type Locator, type Page } from '@playwright/test';
import { Table } from './components/Table';

export class TypeBrowser {
  readonly page: Page;
  readonly locator: Locator;
  readonly header: Locator;
  readonly table: Table;
  readonly search: Locator;
  readonly cancel: Locator;
  readonly apply: Locator;

  constructor(page: Page) {
    this.page = page;
    this.locator = this.page.getByRole('dialog');
    this.header = this.locator.locator('.ui-dialog-title');
    this.cancel = this.locator.getByRole('button', { name: 'Cancel' });
    this.apply = this.locator.getByRole('button', { name: 'Apply' });
    this.table = new Table(page, this.locator);
    this.search = this.locator.getByRole('textbox').first();
  }
}
