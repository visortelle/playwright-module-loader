import { load as _load } from "playwright-module-loader";
import createWebpackConfig from "../webpack.config";

/** Helper function with preconfigured webpack. */
export function load(...[modules, context, options]: Parameters<typeof _load>): ReturnType<typeof _load> {
  return _load(
    modules,
    context,
    { webpackConfig: createWebpackConfig(undefined, { mode: "development" }), ...options }
  );
}
