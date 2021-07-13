import React from 'react';
import ReactDOM from 'react-dom';

/** Mount a React element to blank page.
 * This function should be availale in the browser context.
*/
export function mount(reactElement: React.ReactElement): void {
  const reactRootId = 'playwright-module-loader-react-helper';
  const oldReactRoot = document.getElementById(reactRootId);

  if (oldReactRoot) {
    document.removeChild(oldReactRoot);
  }

  const reactRoot = document.createElement('div');
  reactRoot.id = reactRootId;
  document.body.appendChild(reactRoot);

  ReactDOM.render(reactElement, reactRoot);
};
