import { type Locator, type Page } from '@playwright/test';
import { Select } from './components/Select';

export class SchemaGenerateDialog {
  readonly page: Page;
  readonly locator: Locator;
  readonly type: Select;
  readonly generatedSql: Locator;
  readonly message: Locator;
  readonly cancel: Locator;
  readonly execute: Locator;
  readonly retry: Locator;
  readonly close: Locator;

  constructor(page: Page) {
    this.page = page;
    this.locator = this.page.getByRole('dialog');
    this.type = new Select(this.page, this.locator, { name: 'Generation Type' });
    this.generatedSql = this.locator.locator('pre');
    this.message = this.locator.locator('[data-slot="message"]');
    this.cancel = this.locator.getByRole('button', { name: 'Cancel' });
    this.execute = this.locator.getByRole('button', { name: 'Execute' });
    this.retry = this.locator.getByRole('button', { name: 'Retry' });
    this.close = this.locator.getByRole('button', { name: 'Close' });
  }
}
