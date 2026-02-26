import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class Section {
  readonly trigger: Locator;
  readonly content: Locator;

  constructor(
    readonly page: Page,
    parentLocator: Locator,
    label: string
  ) {
    const buttonLocator = page.locator(`.ui-collapsible-trigger`, { hasText: new RegExp(`^${label}$`) });
    this.trigger = parentLocator.locator(buttonLocator);
    this.content = parentLocator.locator(`.ui-collapsible`, { has: buttonLocator });
  }

  async toggle() {
    await this.trigger.click();
  }

  async open() {
    if ((await this.trigger.getAttribute('data-state')) === 'closed') {
      await this.trigger.click();
    }
  }

  async close() {
    if ((await this.trigger.getAttribute('data-state')) === 'open') {
      await this.trigger.click();
    }
  }

  async isOpen() {
    return (await this.trigger.getAttribute('data-state')) === 'open';
  }

  async expectIsClosed() {
    await expect(this.trigger).toHaveAttribute('data-state', 'closed');
  }

  async expectIsOpen() {
    await expect(this.trigger).toHaveAttribute('data-state', 'open');
  }
}
