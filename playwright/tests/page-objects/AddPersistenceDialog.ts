import { type Locator, type Page } from '@playwright/test';
import { Select } from './components/Select';
import { Textbox } from './components/Textbox';

export class AddPersistenceDialog {
  readonly page: Page;
  readonly locator: Locator;
  readonly name: Textbox;
  readonly dataSource: Select;
  readonly cancel: Locator;
  readonly create: Locator;

  constructor(page: Page) {
    this.page = page;
    this.locator = this.page.getByRole('dialog');
    this.name = new Textbox(this.locator, { name: 'Name' });
    this.dataSource = new Select(page, this.locator, { name: 'Data Source' });
    this.cancel = this.locator.getByRole('button', { name: 'Cancel' });
    this.create = this.locator.getByRole('button', { name: 'Create' });
  }
}
