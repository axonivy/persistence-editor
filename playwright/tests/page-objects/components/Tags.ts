import { expect, type Locator, type Page } from '@playwright/test';

export class Tags {
  readonly locator: Locator;
  readonly add: Locator;
  readonly tags: Locator;

  constructor(
    readonly page: Page,
    readonly parentLocator: Locator
  ) {
    this.locator = this.parentLocator.locator('.tags');
    this.add = this.locator.getByRole('button', { name: 'Add Managed Class' });
    this.tags = this.locator.locator('.added-tag');
  }

  tag(index: number) {
    return new Tag(this.tags.nth(index));
  }

  async expectTags(tags: string[]) {
    for (let i = 0; i < tags.length; i++) {
      await expect(this.tags.nth(i)).toHaveText(tags[i]!);
    }
  }
}

export class Tag {
  readonly locator: Locator;
  readonly remove: Locator;

  constructor(tag: Locator) {
    this.locator = tag;
    this.remove = this.locator.getByRole('button', { name: 'Remove Managed Class' });
  }
}
