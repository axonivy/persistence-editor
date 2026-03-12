import { type Locator, type Page } from '@playwright/test';
import { Combobox } from './components/Combobox';
import { Select } from './components/Select';
import { Table } from './components/Table';
import { Textbox } from './components/Textbox';

export class Detail {
  readonly page: Page;
  readonly locator: Locator;
  readonly header: Locator;
  readonly help: Locator;
  readonly name: Textbox;
  readonly dataSource: Select;
  readonly managedClasses: Combobox;
  readonly description: Textbox;
  readonly inclusionMode: Select;
  readonly properties: Table;

  constructor(page: Page) {
    this.page = page;
    this.locator = this.page.locator('#persistence-editor-detail');
    this.header = this.locator.locator('.ui-sidebar-header');
    this.help = this.locator.getByRole('button', { name: 'Open Help' });
    this.name = new Textbox(this.locator, { name: 'Name' });
    this.description = new Textbox(this.locator, { name: 'Description' });
    this.dataSource = new Select(page, this.locator, { name: 'Data Source' });
    this.inclusionMode = new Select(page, this.locator, { name: 'Included Classes' });
    this.managedClasses = new Combobox(page, this.locator, { name: 'Listed Classes' });
    this.properties = new Table(page, this.locator);
  }
}
