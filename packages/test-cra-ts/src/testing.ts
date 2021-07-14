import { loadWithWebpack } from "playwright-module-loader";
import createWebpackConfig from "react-scripts/config/webpack.config";

/** Helper function with preconfigured webpack. */
export function load(...[modules, context, options]: Parameters<typeof loadWithWebpack>): ReturnType<typeof loadWithWebpack> {
  return loadWithWebpack(
    {
      ...modules,
      ct: 'playwright-module-loader/ct/react'
     },
    context,
    { webpackConfig: createWebpackConfig('development'), ...options }
  );
}
