# playwright-module-loader

| Webpack | Playwright |
| --- | --- |
| 4.x.x 🤷‍♂️ | < 1.12.x 🤷‍♂️|
| 5.x.x ✅ | 1.12.x ✅ |

## Load modules

[Playwright](https://github.com/microsoft/playwright) has a `page.evaluate` function that allows to
run some code in the browser context. 

As I know, unfortunately Playwright doesn't implement ability to load local modules to browser context.

This package tries to fix it.

## Component testing

Also it's a simple component testing implemenation for the Playwright.

No type safe by design 🤨, but at least we can use it now.

Maybe a better approach will be provided by Playwright maintainers. In any case it shouldn't be hard to migrate tests to officially supported implementation. Tracking issue: https://github.com/microsoft/playwright/issues/7148.

[See usage example](./packages/test-react-ts/src/Button/Button.spec.ts).

## FAQ

- Given an error similar to: `page.evaluate: Evaluation failed: Error: A cross-origin error was thrown. React doesn't have access to the actual error object in development. See https://reactjs.org/link/crossorigin-error for more information.`.
  
Solution: call `await page.pause()` before the line where the error happens and try to call the evaluation code in the devtools console.

## Contributing 

Clone the repo, then run `npm test`.
