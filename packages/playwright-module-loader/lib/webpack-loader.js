"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.load = void 0;
const webpack_1 = __importDefault(require("webpack"));
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const webpack_config_monkey_patches_1 = require("./webpack-config-monkey-patches");
const projectName = "playwright-module-loader";
const defaultOptions = {
    debug: false,
    ci: false,
    webpackConfig: {},
};
/**
 * Compile modules and make them available in the global context.
 * Uses webpack under the hood.
 */
function load(modules, context, options) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((onSuccess, onFail) => __awaiter(this, void 0, void 0, function* () {
            const _options = Object.assign(Object.assign({}, defaultOptions), options);
            const page = context.pages()[0];
            const webpackConfig = _options.webpackConfig;
            yield webpack_config_monkey_patches_1.monkeyPatch(webpackConfig, context);
            // Override default webpack entry with provided modules list.
            webpackConfig.entry = modules;
            // Output build result to temporary directory.
            const outputDir = path_1.default.resolve(os_1.default.tmpdir(), `./${projectName}`);
            webpackConfig.output = {
                path: outputDir,
                filename: "[name].[contenthash].js",
                library: {
                    // Make modules available as variables in the global context.
                    type: "window",
                    name: "[name]",
                },
            };
            console.log(webpackConfig);
            const compiler = webpack_1.default(webpackConfig);
            log('Compiling modules ...');
            log(`Output dir: ${outputDir}`);
            compiler.run(onCompile);
            function onCompile(err, stats) {
                return __awaiter(this, void 0, void 0, function* () {
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
                    const promises = assets.map((asset) => __awaiter(this, void 0, void 0, function* () {
                        const js = fs_1.default.readFileSync(path_1.default.resolve(outputDir, `./${asset}`), {
                            encoding: "utf-8",
                        });
                        yield context.addInitScript({ content: initJsAfterLoad(js) });
                        if (_options.debug) {
                            const modulePath = path_1.default.resolve(outputDir, asset);
                            const logMessage = `${projectName}: module loaded "${modulePath}"`;
                            yield context.addInitScript({
                                content: `console.debug('${logMessage}');`,
                            });
                        }
                    }));
                    const loadScriptsStartTime = Date.now();
                    yield Promise.all(promises);
                    // Open a blank page after modules are loaded.
                    // TODO - Consider add `thenGoto(...)` option to avoid unnecessary page reload if test page shouldn't be the blank page.
                    yield page.reload();
                    log(`Adding modules to the page took ${((Date.now() - loadScriptsStartTime) / 1000).toFixed(2)} seconds.`);
                    log("Modules should be available at the page's global context, in other words as `window.ModuleName`.");
                    log("If you have questions, feel free to raise an issue here: https://github.com/visortelle/playwright-module-loader");
                    onSuccess();
                });
            }
        }));
    });
}
exports.load = load;
/** We don't remove the whole working folder after each run to allow webpack to use caching with contenthash. */
function scheduleFsCleanup(dir, assets) {
    process.on("exit", () => {
        assets.forEach((asset) => {
            const fileName = path_1.default.resolve(dir, asset);
            if (fs_1.default.existsSync(fileName)) {
                fs_1.default.unlinkSync(fileName);
            }
        });
    });
}
/** Initially it's a fix for the following error that appeared when loaded a module that was compiled using style-loader:
 * Uncaught Error: Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.
 *
 * There are more issues can potentially appear without this fix.
 */
function initJsAfterLoad(js) {
    return `globalThis.addEventListener('load', function() { ${js} });`;
}
function log(message) {
    console.log(`${projectName}: ${message}`);
}
