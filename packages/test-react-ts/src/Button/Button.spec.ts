import { test, expect } from "@playwright/test";
import { load } from '../playwright-module-loader';

test("TestButton contains text", async ({ page, context }) => {
  await load(
    {
      Button: "src/Button/Button.tsx",
      React: "react",
      ReactDOM: "react-dom",
    },
    context
  );

  await page.evaluate(() => {
    const reactRoot = document.createElement("div");
    document.body.appendChild(reactRoot);
    ReactDOM.render(React.createElement(Button.default), reactRoot);
  });

  const testButton = await page.waitForSelector('#test-button');
  expect(await testButton.innerText()).toBe('Test button');
});
