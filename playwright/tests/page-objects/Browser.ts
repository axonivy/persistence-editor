import { type Locator, type Page } from '@playwright/test';
import { Section } from './components/Section';
import { Table } from './components/Table';

export class Browser {
  readonly page: Page;
  readonly view: Locator;
  readonly table: Table;
  readonly info: Section;

  constructor(page: Page) {
    this.page = page;
    this.view = page.getByRole('dialog');
    this.table = new Table(page, this.view);
    this.info = new Section(page, this.view, 'Info');
  }
}
