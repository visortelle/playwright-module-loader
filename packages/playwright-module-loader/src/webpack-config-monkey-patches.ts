import  fs from 'fs';
import path from 'path';
import { BrowserContext } from '@playwright/test';
import { Configuration } from "webpack";

export async function monkeyPatch(webpackConfig: Configuration, context: BrowserContext): Promise<void> {
  // Fail on errors instead of tolerating them.
  webpackConfig.bail = true;

  // Force development mode to increase build speed.
  webpackConfig.mode = "development";

  // Force source maps type that works in this setup. Optionally disable source maps.
  // webpackConfig.devtool = _options.ci ? false : "inline-cheap-source-map"; // TODO - fix sourcemaps
  webpackConfig.devtool = false;

  // Remove various stuff that prevent proper builds.
  delete webpackConfig.optimization?.runtimeChunk;
  delete webpackConfig.optimization?.splitChunks;

  await fixReact(webpackConfig, context);
}

/** This function mutates webpack config and fixes this in-browser error
 * when you trying to render React components that uses the React hooks API:
 *
 * VM17:2827 Uncaught Error: Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.
    at resolveDispatcher (<anonymous>:2827:13)
    at Object.useState (<anonymous>:2858:20)
    at exports.default (<anonymous>:3761:43)
    at renderWithHooks (<anonymous>:15138:18)
    at mountIndeterminateComponent (<anonymous>:17964:13)
    at beginWork (<anonymous>:19202:16)
    at HTMLUnknownElement.callCallback (<anonymous>:4098:14)
    at Object.invokeGuardedCallbackDev (<anonymous>:4147:16)
    at invokeGuardedCallback (<anonymous>:4209:31)
    at beginWork$1 (<anonymous>:24112:7)
*/
async function fixReact(webpackConfig: Configuration, context: BrowserContext): Promise<void> {
  await context.addInitScript({ content: fs.readFileSync(path.resolve(__dirname, '../src/react.development.js'), { encoding: 'utf-8' }) });
  await context.addInitScript({ content: fs.readFileSync(path.resolve(__dirname, '../src/react-dom.development.js'), { encoding: 'utf-8' }) });

  webpackConfig.externals = {
    react: 'React',
    'react-dom': 'ReactDOM'
  }
}
