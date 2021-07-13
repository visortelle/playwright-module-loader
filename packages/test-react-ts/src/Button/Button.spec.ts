import { test, expect } from "@playwright/test";
import { load } from '../testing';

test("TestButton contains text", async ({ page, context }) => {
  await load({ Button: "src/Button/Button.tsx" }, context);

  await page.evaluate(() => {
    ct.mount(React.createElement(Button.default));
  });

  const testButton = await page.waitForSelector('#test-button');
  expect(await testButton.innerText()).toBe('Test button');
});
