import { type Locator, type Page } from '@playwright/test';
import { Textbox } from './components/Textbox';

export class Detail {
  readonly page: Page;
  readonly locator: Locator;
  readonly header: Locator;
  readonly help: Locator;
  readonly content: Locator;
  readonly name: Textbox;
  readonly dataSource: Textbox;

  constructor(page: Page) {
    this.page = page;
    this.locator = this.page.locator('.persistence-editor-detail-panel');
    this.header = this.locator.locator('.persistence-editor-detail-header');
    this.help = this.locator.getByRole('button', { name: 'Open Help' });
    this.content = this.locator.locator('.persistence-editor-detail-content');
    this.name = new Textbox(this.locator, { name: 'Name' });
    this.dataSource = new Textbox(this.locator, { name: 'Data Source' });
  }
}
