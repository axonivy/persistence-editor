import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class Checkbox {
  readonly locator: Locator;

  constructor(
    readonly page: Page,
    readonly parentLocator: Locator,
    label?: string
  ) {
    this.locator = parentLocator.getByRole('checkbox', { name: label }).first();
  }

  async toggle() {
    await this.locator.click();
  }

  async expectValue(value: boolean) {
    if (value) {
      await expect(this.locator).toBeChecked();
    } else {
      await expect(this.locator).not.toBeChecked();
    }
  }
}
