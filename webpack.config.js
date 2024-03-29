const path = require("path");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const globImporter = require("node-sass-glob-importer");
const extract = require("mini-css-extract-plugin");

const dist = path.resolve(__dirname, "dist");

const dev = process.env.NODE_ENV !== "production";

module.exports = {
    entry: {
        index: "./js/index.js",
    },
    devtool: dev ? "eval-cheap-module-source-map" : "source-map",
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    extract.loader,
                    "css-loader",
                    {
                        loader: "sass-loader",
                        options: { sassOptions: { importer: globImporter() } },
                    },
                ],
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|pkg)/,
                use: ["babel-loader"],
            },
            {
                test: /\.(png|jpe?g|gif|svg|ttf|ico)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            outputPath: "assets",
                        },
                    },
                ],
            },
        ],
    },
    optimization: {
        splitChunks: { chunks: "all" },
    },
    output: {
        path: dist,
        filename: "[name].js",
    },
    devServer: {},
    plugins: [
        new WasmPackPlugin({
            crateDirectory: __dirname,
            watchDirectories: [
               path.resolve(__dirname, "derive")
           ],
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "static", "index.html"),
            /* favicon: "./src/favicon.ico" */
        }),
        new MiniCssExtractPlugin(),
    ],
    experiments: {
        asyncWebAssembly: true,
        syncWebAssembly: true,
        topLevelAwait: true,
    },
};
