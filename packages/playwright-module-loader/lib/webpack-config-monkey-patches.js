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
exports.monkeyPatch = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function monkeyPatch(webpackConfig, context) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        // Fail on errors instead of tolerating them.
        webpackConfig.bail = true;
        // Force development mode to increase build speed.
        webpackConfig.mode = "development";
        // Force source maps type that works in this setup. Optionally disable source maps.
        // webpackConfig.devtool = _options.ci ? false : "inline-cheap-source-map"; // TODO - fix sourcemaps
        webpackConfig.devtool = false;
        // Remove various stuff that prevent proper builds.
        (_a = webpackConfig.optimization) === null || _a === void 0 ? true : delete _a.runtimeChunk;
        (_b = webpackConfig.optimization) === null || _b === void 0 ? true : delete _b.splitChunks;
        yield fixReact(webpackConfig, context);
    });
}
exports.monkeyPatch = monkeyPatch;
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
function fixReact(webpackConfig, context) {
    return __awaiter(this, void 0, void 0, function* () {
        yield context.addInitScript({ content: fs_1.default.readFileSync(path_1.default.resolve(__dirname, '../src/react.development.js'), { encoding: 'utf-8' }) });
        yield context.addInitScript({ content: fs_1.default.readFileSync(path_1.default.resolve(__dirname, '../src/react-dom.development.js'), { encoding: 'utf-8' }) });
        webpackConfig.externals = {
            'react': 'React',
            'react-dom': 'ReactDOM'
        };
    });
}
