import { test, expect } from "@playwright/test";
import { load } from '../testing';

test("ButtonWithHooks contains text", async ({ page, context }) => {
  await load({ ButtonWithHooks: "src/ButtonWithHooks/ButtonWithHooks.tsx" }, context);

  await page.evaluate(() => {
    ct.mount(React.createElement(ButtonWithHooks.default));
  });

  await page.pause();

  const testButton = await page.waitForSelector('#test-button');
  expect(await testButton.innerText()).toMatch(/^Test button \d*$/);
});
