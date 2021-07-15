# playwright-module-loader

## Load local modules to browser

[Playwright](https://github.com/microsoft/playwright) has a `page.evaluate` function that allows to
run some code in the browser context.

As I know, unfortunately Playwright doesn't implement ability to load local modules to browser context.

This package tries to fix it.

## Component testing

This module provides a simple component testing implemenation for the Playwright.

There is an implemented `mount(reactElement)` helper function for React.

Example: [Button.spec.ts](./packages/test-react-ts/src/Button/Button.spec.ts).

The `React.createElement(Button.default)` instead of JSX syntax may looks ugly, but it's fixable after solving https://github.com/microsoft/playwright/issues/7121.

For now I don't see how to easilly fix IDE support (typechicking, autocompletion).

I hope that a better approach will be provided by Playwright maintainers. In any case it shouldn't be hard to migrate tests to officially supported implementation. Tracking issue: https://github.com/microsoft/playwright/issues/7148.

## Usage

Install Playwright test runner. Follow official [instructions](https://playwright.dev/docs/test-intro).

Install this package by running `npm i -D playwright-module-loader`.

Create you `load()` function:

- Regular typescript + webpack setup: [testing.ts](./packages/test-react-ts/src/testing.ts).
- 🔴 Create React App isn't supported yet. There is an example: [testing.ts](./packages/test-cra-ts/src/testing.ts) Awaiting for [migration to the webpack v5](https://github.com/facebook/create-react-app/issues/9994).

Write test: [Button.spec.ts](./packages/test-react-ts/src/Button/Button.spec.ts).

## Disclaimer

This package is tested with webpack config I use in a pet project, so don't give any guarantees.

You can try it with your webpack configuration and it's the only way we can figure out is it works or not. 🙂

| Webpack | Playwriaght |  |
| --- | --- | --- |
| 5.x.x 🟢 | 1.12.x 🟢 | |
| 4.x.x 🔴 | < 1.12.x 🔴 | Regarding webpack v4 - I just don't want to introduce extra complexity and support it. If you want, PRs are welcome. |

## FAQ

- Given an error similar to: `page.evaluate: Evaluation failed: Error: A cross-origin error was thrown. React doesn't have access to the actual error object in development. See https://reactjs.org/link/crossorigin-error for more information.`.
  
Solution: call `await page.pause()` before the line where the error happens and try to call the evaluation code in the devtools console.

## Contributing

Clone the repo, `npm run build`, then run `npm test`.

Release: no CI or any other automation for now. Change package version manually, then `npm publish`, `git tag v1.x.x`, `git push --tag`.
