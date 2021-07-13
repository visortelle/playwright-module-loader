import path from "path";
import webpack, { Configuration } from "webpack";
import TerserPlugin from "terser-webpack-plugin";

export default (_: any, { mode }: { mode: "development" | "production" }): Configuration => ({
  mode,
  entry: path.resolve(__dirname, "./src/index.ts"),
  optimization: {
    minimize: mode === "production",
    minimizer:
      mode === "production"
        ? [
            new TerserPlugin({
              parallel: true,
              terserOptions: {
                // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
              },
            }),
          ]
        : [],
    moduleIds: "deterministic",
    usedExports: false,
    runtimeChunk: 'single', // Don't remove
    splitChunks: { // Don't remove
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  devtool: mode === "production" ? "source-map" : "eval-source-map",
  plugins: [
    // Fix for `process is not defined` error
    // The reason of this issue here:
    // https://github.com/brianzinn/react-babylonjs/blob/d50190790a919b6c63754bda2a28580a20262585/src/render.ts#L48
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
  ],
  module: {
    rules: [
      // The `\.m?js/` rule is a fix for the following error:
      // Cannot find module '@babylonjs/core/Maths/math'
      // BREAKING CHANGE: The request '...' failed to resolve only because it was resolved as fully specified
      // (probably because the origin is a '*.mjs' file or a '*.js' file where the package.json contains '"type": "module"').
      // The extension in the request is mandatory for it to be fully specified.
      // Add the extension to the request.
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
          options: {
            // disable type checker for faster build in development
            transpileOnly: mode !== "production",
            configFile: path.resolve(__dirname, './tsconfig.json')
          },
        },
        include: path.resolve(__dirname, './src'),
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
        include: path.resolve(__dirname, './src'),
      },
    ],
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'),
    },
    extensions: [".wasm", ".tsx", ".ts", ".mjs", ".js", ".json"],
    // symlinks: false,
  },
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "[name].js",
  },
});
