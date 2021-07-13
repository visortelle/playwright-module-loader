import { loadWithWebpack } from "playwright-module-loader";
import createWebpackConfig from "../webpack.config";

/** Helper function with preconfigured webpack. */
export function load(...[modules, context, options]: Parameters<typeof loadWithWebpack>): ReturnType<typeof loadWithWebpack> {
  return loadWithWebpack(
    {
      ...modules,
      React: 'react',
      ReactDOM: 'react-dom',
      ct: 'playwright-module-loader-react-helper'
     },
    context,
    { webpackConfig: createWebpackConfig(undefined, { mode: "development" }), ...options }
  );
}
