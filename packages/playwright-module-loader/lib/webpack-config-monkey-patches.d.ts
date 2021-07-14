import { BrowserContext } from '@playwright/test';
import { Configuration } from "webpack";
export declare function monkeyPatch(webpackConfig: Configuration, context: BrowserContext): Promise<void>;
