import webpack, { Configuration as WebpackConfig } from "webpack";
import { BrowserContext } from "@playwright/test";
import fs from "fs";
import os from "os";
import path from "path";
import { monkeyPatch } from './webpack-config-monkey-patches';

const projectName = "playwright-module-loader";

type Options = {
  /**
   * Enable more logging.
   * Don't cleanup temporary files after completion.
   */
  debug?: boolean;
  /**
   * Set to true enables the following optimizations for faster build.
   * - Disable source maps.
   * - Disable extra evaluations.
   * */
  ci?: boolean;
  /** Default configuration may work in very simple cases, but implied that you'll provide your webpack config.
   * Maybe default webpack configuration will be improved in further versions.
   */
  webpackConfig?: WebpackConfig | unknown; // union with `unknown` type here is because of uncomplete TypeScript typings in @types/webpack module <= 5.28.0.
};
const defaultOptions: Options = {
  debug: false,
  ci: false,
  webpackConfig: {},
};

/**
 * Compile modules and make them available in the global context.
 * Uses webpack under the hood.
 */
export async function load(
  modules: Record<string, string>,
  context: BrowserContext,
  options?: Options
): Promise<void> {
  return new Promise(async (onSuccess, onFail) => {
    const _options = { ...defaultOptions, ...options };
    const page = context.pages()[0];
    const webpackConfig = _options.webpackConfig as WebpackConfig;

    await monkeyPatch(webpackConfig);

    // Override default webpack entry with provided modules list.
    webpackConfig.entry = modules;

    // Output build result to temporary directory.
    const outputDir = path.resolve(os.tmpdir(), `./${projectName}`);
    webpackConfig.output = {
      path: outputDir,
      filename: "[name].[contenthash].js",
      library: {
        // Make modules available as variables in the global context.
        type: "window",
        name: "[name]",
      },
    };

    const compiler = webpack(webpackConfig);

    log('Compiling modules ...');
    log(`Output dir: ${outputDir}`);
    compiler.run(onCompile);

    async function onCompile(
      err?: webpack.StatsError,
      stats?: webpack.Stats
    ): Promise<void> {
      if (err) {
        console.error(err);
        onFail();
        return;
      }

      if (!stats) {
        return;
      }

      log(`Compilation took ${((stats.endTime - stats.startTime) / 1000).toFixed(2)} seconds`);
      const assets = Object.keys(stats.compilation.assets);

      // Sometimes it's useful to inspect compilation result.
      if (!_options.debug) {
        scheduleFsCleanup(outputDir, assets);
      }

      const promises: Promise<void>[] = assets.map(async (asset) => {
        const js = fs.readFileSync(path.resolve(outputDir, `./${asset}`), {
          encoding: "utf-8",
        });

        await context.addInitScript({ content: initJsAfterLoad(js) });

        if (_options.debug) {
          const modulePath = path.resolve(outputDir, asset);
          const logMessage = `${projectName}: module loaded "${modulePath}"`;
          await context.addInitScript({
            content: `console.debug('${logMessage}');`,
          });
        }
      });

      const loadScriptsStartTime = Date.now();
      await Promise.all(promises);

      // Open a blank page after modules are loaded.
      // TODO - Consider add `thenGoto(...)` option to avoid unnecessary page reload if test page shouldn't be the blank page.
      await page.reload();
      log(`Adding modules to the page took ${((Date.now() - loadScriptsStartTime) / 1000).toFixed(2)} seconds.`);

      log("Modules should be available at the page's global context, in other words as `window.ModuleName`.");
      log("If you have questions, feel free to raise an issue here: https://github.com/visortelle/playwright-module-loader");
      onSuccess();
    }
  });
}

/** We don't remove the whole working folder after each run to allow webpack to use caching with contenthash. */
function scheduleFsCleanup(dir: string, assets: string[]) {
  process.on("exit", () => {
    assets.forEach((asset) => {
      const fileName = path.resolve(dir, asset);
      if (fs.existsSync(fileName)) {
        fs.unlinkSync(fileName);
      }
    });
  });
}

/** Initially it's a fix for the following error that appeared when loaded a module that was compiled using style-loader:
 * Uncaught Error: Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.
 *
 * There are more issues can potentially appear without this fix.
 */
function initJsAfterLoad(js: string): string {
  return `globalThis.addEventListener('load', function() { ${js} });`;
}

function log(message: string): void {
  console.log(`${projectName}: ${message}`);
}
