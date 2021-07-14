"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mount = void 0;
const react_dom_1 = __importDefault(require("react-dom"));
/** Mount a React element to blank page.
 * This function should be availale in the browser context.
*/
function mount(reactElement) {
    const reactRootId = 'playwright-module-loader-react-helper';
    const oldReactRoot = document.getElementById(reactRootId);
    if (oldReactRoot) {
        document.removeChild(oldReactRoot);
    }
    const reactRoot = document.createElement('div');
    reactRoot.id = reactRootId;
    document.body.appendChild(reactRoot);
    react_dom_1.default.render(reactElement, reactRoot);
}
exports.mount = mount;
;
