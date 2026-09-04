import type { Page } from '@playwright/test';
import { Detail } from './Detail';
import { Main } from './Main';
import { Toolbar } from './Toolbar';

export const server = process.env.BASE_URL ?? 'localhost:8080/';
export const user = 'Developer';
const ws = '~Developer-persistence-test-project';
const app = process.env.TEST_APP ?? 'Developer-persistence-test-project';
const project = 'persistence-test-project';

export class PersistenceEditor {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private static async open(page: Page, url = '') {
    await page.goto(url);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addStyleTag({ content: `.tsqd-parent-container { display: none; }` });
    return new PersistenceEditor(page);
  }

  static async openPersistence(page: Page, options?: { readonly?: boolean; theme?: string }) {
    const serverUrl = server.replace(/^https?:\/\//, '');
    let url = `?server=${serverUrl}${ws}&app=${app}&project=${project}&file=config/persistence.yaml`;
    if (options) {
      url += Object.entries(options)
        .map(([key, value]) => `&${key}=${value}`)
        .join('');
    }
    return await this.open(page, url);
  }

  static async openMock(page: Page) {
    const url = `mock.html`;
    return await this.open(page, url);
  }

  get toolbar() {
    return new Toolbar(this.page);
  }

  get main() {
    return new Main(this.page);
  }

  get detail() {
    return new Detail(this.page);
  }
}
