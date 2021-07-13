import { test, expect } from "@playwright/test";
import { load } from '../testing';

test("ButtonWithHooks contains text", async ({ page, context }) => {
  await load({ ButtonWithHooks: "src/ButtonWithHooks/ButtonWithHooks.tsx" }, context);

  await page.pause();

  await page.evaluate(() => {
    ct.mount(React.createElement(ButtonWithHooks.default));
  });

  const testButton = await page.waitForSelector('#test-button');
  expect(await testButton.innerText()).toBe('Test button');
});
