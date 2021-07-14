import { Configuration as WebpackConfig } from "webpack";
import { BrowserContext } from "@playwright/test";
declare type Options = {
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
    webpackConfig?: WebpackConfig | unknown;
};
/**
 * Compile modules and make them available in the global context.
 * Uses webpack under the hood.
 */
export declare function load(modules: Record<string, string>, context: BrowserContext, options?: Options): Promise<void>;
export {};
