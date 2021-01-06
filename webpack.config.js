require("dotenv").config();

const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require('webpack');
const path = require("path");

const os = require('os');
const ifaces = os.networkInterfaces();

const version = require("./package.json").version;

let mode = (process.env.MODE || "development");
// let mode = "production";

function getIp() {
    let ip = null;
    Object.keys(ifaces).some(function (ifname) {
        return ifaces[ifname].some(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                return false;
            }

            ip = iface.address;
            return true;
        });
    });
    return ip;
}

let moduleExports = {

    //Development oder production, wird oben durch Variable angegeben (damit später per IF überprüft)
    mode: mode,

    //Beinhaltet den JS-Startpunkt und SCSS-Startpunkt
    entry: [
        __dirname + "/src/client/js/script.js",
        __dirname + "/src/client/sass/index.scss",
    ],
    // devtool: 'inline-source-map',

    //Gibt Ausgabename und Ort für JS-File an
    output: {
        path: path.resolve(__dirname, 'www'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: [".ts", ".js", ".mjs", ".json", "png"]
    },

    optimization: {
        // minimize: false,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    parallel: true,
                    cache: true,
                    sourceMap: true, // Must be set to true if using source-maps in production
                    mangle: {
                        reserved: [
                            "BlockedDay",
                            "Church",
                            "Event",
                            "Fsj",
                            "FsjChurchBaseObject",
                            "Post",
                            "Region",
                            "RepeatedEvent",
                            "Favorite",
                            "Version",
                            "Access",
                            "AccessEasySyncModel",
                            "Role",
                            "User",
                            "churchImages",
                            "FileMedium",
                            "fsjImages",
                            "eventImages",
                            "EasySyncBaseModel",
                            "LastSyncDates",
                            "SetupSchema1000000000000",
                            "SetupFavorite1000000000001",
                            "SetupUserManagement1000000001000",
                            "SetupEasySync1000000000500",
                            "FavoriteWithSystemCalendar1000000000002",
                            "FsjSchema1000000006000",
                            "AddRepeatedEvent1000000007000",
                            "FavoriteWithoutEventRelation1000000008000",
                            "ClearDatabaseMigration1000000000000",
                            "ImagesSchema1000000010000",
                            "ImagesSchemaDownload1000000011000",
                        ],
                        keep_fnames: /[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]$/,
                    },
                }
            })
        ]
    },

    plugins: [
        //Delete www before every Build (to only have nessesary files)
        new CleanWebpackPlugin({cleanOnceBeforeBuildPatterns: ['**/*', '!**/.gitkeep']}),

        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve("./node_modules/sql.js/dist/sql-wasm.js"),
                    to: "scripts/"
                },
                {
                    from: path.resolve("./node_modules/sql.js/dist/sql-wasm.wasm"),
                    to: "sql-wasm.wasm"
                },
                {
                    from: path.resolve("./node_modules/localforage/dist/localforage.js"),
                    to: "scripts/"
                },
            ]
        }),
        new webpack.NormalModuleReplacementPlugin(/typeorm$/, function (result) {
            result.request = result.request.replace(/typeorm/, "typeorm/browser");
        }),

        //Erstellt (kopiert) die Index.html
        new HtmlWebpackPlugin({
            template: 'src/client/index.html'
        }),
        new webpack.DefinePlugin({
            __HOST_ADDRESS__: "'" + (process.env.HOST_URI || ((process.env.HOST || ("http://" + getIp())) + ":" + (process.env.REQUEST_PORT || process.env.PORT || "3000"))) + "'",
            __MAPS_API_KEY__: "'" + process.env.GOOGLE_MAPS_API_KEY + "'",
            __VERSION__: "'" + version + "'",
            __CONTACT_EMAIL__: "'" + process.env.CONTACT_EMAIL + "'",
        }),

        // new WorkboxPlugin.GenerateSW({
        //     maximumFileSizeToCacheInBytes: 1024 * 1024 * 1024 * 5
        // }),

        // new webpack.ProvidePlugin({
        //     'window.initSqlJs': path.join(__dirname, 'node_modules/sql.js/dist/sql-asm.js'),
        // }),
    ],

    module: {

        //Regeln: Wenn Regex zutrifft => führe Loader (in UMGEKEHRTER) Reihenfolge aus
        rules: [
            {
                //Kopiert HTML-Dateien in www. Nur die Dateien, welche im JS angefragt werden
                test: /index.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            //Sorgt dafür, dass Child-Views funktionieren
                            attributes: {
                                list: [
                                    {
                                        "attribute": "data-view",
                                        "type": "src"
                                    },
                                    {
                                        "attribute": "src",
                                        "type": "src"
                                    },
                                    {
                                        "attribute": "href",
                                        "tag": "link",
                                        "type": "src"
                                    },
                                ],
                                urlFilter: (attribute, value, resourcePath) => {
                                    return !value.endsWith(".js") && !value.endsWith(".css");
                                }
                            }
                        }
                    }
                ],
            },
            {
                //Kopiert HTML-Dateien in www. Nur die Dateien, welche im JS angefragt werden
                test: /html[\\\/].*\.html$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'html',
                            esModule: false
                        }
                    },
                    {
                        loader: 'extract-loader'
                    },
                    {
                        loader: 'html-loader',
                        options: {
                            //Sorgt dafür, dass Child-Views funktionieren
                            attributes: {
                                list: [
                                    {
                                        "attribute": "data-view",
                                        "type": "src"
                                    },
                                    {
                                        "attribute": "src",
                                        "type": "src"
                                    },
                                    {
                                        "attribute": "href",
                                        "tag": "link",
                                        "type": "src"
                                    },
                                ],
                            }
                        }
                    }
                ],
            },
            {
                test: /\.tsx?$/,
                use: ["ts-loader"],
            },
            {
                //Kopiert nur benutzte Bilder/Videos/Sound (benutzt durch JS (import), html oder css/sass)
                test: /(img|video|sound)[\\\/]/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: "[name].[ext]",
                            outputPath: 'img',
                            publicPath: function (url, resourcePath, context) {
                                return "/img/" + url;
                            },
                        }
                    },
                ],
            },
            {
                //Compiliert SASS zu CSS und speichert es in Datei
                test: /\.scss$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].css',
                            outputPath: 'css',
                            // publicPath: '/css'
                        }
                    },
                    {
                        loader: 'extract-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        //Compiliert zu CSS
                        loader: 'sass-loader'
                    }
                ]
            }
        ]
    }
};

//Auslagerung von zeitintensiven Sachen in production only, damit Debugging schneller geht
if (mode === "production") {

    // //Polyfills hinzufügen
    moduleExports["entry"].unshift("@babel/polyfill");
    // moduleExports["devtool"] = "source-map";

    //Transpilieren zu ES5
    moduleExports["module"]["rules"].push({
        test: /\.m?js$/,
        exclude: /node_modules\/(?!(cordova-sites))/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env'],
            }
        }
    });

    moduleExports["module"]["rules"][2]["use"].unshift({
        loader: 'babel-loader',
        options: {
            presets: ['@babel/preset-env'],
            inputSourceMap: "inline",
            sourceMaps: true

        }
    });

    //Hinzufügen von POSTCSS und Autoprefixer für alte css-Präfixe
    moduleExports["module"]["rules"][4]["use"].splice(3, 0, {
        //PostCSS ist nicht wichtig, autoprefixer schon. Fügt Präfixes hinzu (Bsp.: -webkit), wo diese benötigt werden
        loader: 'postcss-loader',
        options: {
            postcssOptions: {
                plugins: [require('autoprefixer')()]
            }
        }
    });
}

module.exports = moduleExports;


// require("dotenv").config();
//
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const {CleanWebpackPlugin} = require('clean-webpack-plugin');
// const CopyWebpackPlugin = require("copy-webpack-plugin");
// const TerserPlugin = require("terser-webpack-plugin");
// const webpack = require('webpack');
// const path = require("path");
//
// const os = require('os');
// const ifaces = os.networkInterfaces();
//
// const version = require("./package.json").version;
//
// let mode = (process.env.MODE || "development");
//
// // let mode = "production";
//
// function getIp() {
//     let ip = null;
//     Object.keys(ifaces).some(function (ifname) {
//         return ifaces[ifname].some(function (iface) {
//             if ('IPv4' !== iface.family || iface.internal !== false) {
//                 // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
//                 return false;
//             }
//
//             ip = iface.address;
//             return true;
//         });
//     });
//     return ip;
// }
//
// let moduleExports = {
//     node: {
//         fs: 'empty',
//         net: 'empty',
//         tls: 'empty'
//     },
//
//     //Development oder production, wird oben durch Variable angegeben (damit später per IF überprüft)
//     mode: mode,
//
//     //Beinhaltet den JS-Startpunkt und SCSS-Startpunkt
//     entry: [
//         // __dirname + "/node_modules/localforage/dist/localforage.js",
//         // __dirname + "/node_modules/sql.js/js/sql-optimized.js",
//         __dirname + "/src//client/js/script.js",
//         __dirname + "/src//client/sass/index.scss",
//     ],
//
//     optimization: {
//         // minimize: false,
//         minimizer: [
//             new TerserPlugin({
//                 terserOptions: {
//                     cache: true,
//                     parallel: true,
//                     sourceMap: true, // Must be set to true if using source-maps in production
//                     terserOptions: {
//                         mangle: {
//                             reserved: [
//                                 "BlockedDay",
//                                 "Church",
//                                 "Event",
//                                 "Fsj",
//                                 "FsjChurchBaseObject",
//                                 "Post",
//                                 "Region",
//                                 "RepeatedEvent",
//                                 "Favorite",
//                                 "Version",
//                                 "Access",
//                                 "AccessEasySyncModel",
//                                 "Role",
//                                 "User",
//                                 "churchImages",
//                                 "FileMedium",
//                                 "fsjImages",
//                                 "eventImages",
//                                 "EasySyncBaseModel",
//                                 "LastSyncDates",
//                                 "SetupSchema1000000000000",
//                                 "SetupFavorite1000000000001",
//                                 "SetupUserManagement1000000001000",
//                                 "SetupEasySync1000000000500",
//                                 "FavoriteWithSystemCalendar1000000000002",
//                                 "FsjSchema1000000006000",
//                                 "AddRepeatedEvent1000000007000",
//                                 "FavoriteWithoutEventRelation1000000008000",
//                                 "ClearDatabaseMigration1000000000000",
//                                 "ImagesSchema1000000010000",
//                                 "ImagesSchemaDownload1000000011000",
//                             ]
//                         }
//                     }
//                 }
//             })
//         ]
//     },
//     devtool: 'source-map',
//
//     //Gibt Ausgabename und Ort für JS-File an
//     output: {
//         path: path.resolve(__dirname, 'www'),
//         filename: 'bundle.js'
//     },
//     resolve: {
//         extensions: [".ts", ".js", ".mjs", ".json"]
//     },
//
//     plugins: [
//         //Delete www before every Build (to only have nessesary files)
//         new CleanWebpackPlugin({cleanOnceBeforeBuildPatterns: ['**/*', '!**/.gitkeep']}),
//
//         new CopyWebpackPlugin({
//             patterns: [
//                 {
//                     from: path.resolve("./node_modules/sql.js/dist/sql-wasm.js"),
//                     to: "scripts/"
//                 },
//                 {
//                     from: path.resolve("./node_modules/sql.js/dist/sql-wasm.wasm"),
//                     to: "sql-wasm.wasm"
//                 },
//                 {
//                     from: path.resolve("./node_modules/localforage/dist/localforage.js"),
//                     to: "scripts/"
//                 }
//             ]
//         }),
//
//         //Erstellt (kopiert) die Index.html
//         new HtmlWebpackPlugin({
//             template: 'src/client/index.html'
//         }),
//
//         new webpack.NormalModuleReplacementPlugin(/typeorm$/, function (result) {
//             result.request = result.request.replace(/typeorm/, "typeorm/browser");
//         }),
//
//         new webpack.DefinePlugin({
//             __HOST_ADDRESS__: "'" + (process.env.HOST_URI || ((process.env.HOST || ("http://" + getIp())) + ":" + (process.env.REQUEST_PORT || process.env.PORT || "3000"))) + "'",
//             __MAPS_API_KEY__: "'" + process.env.GOOGLE_MAPS_API_KEY + "'",
//             __VERSION__: "'" + version + "'",
//             __CONTACT_EMAIL__: "'" + process.env.CONTACT_EMAIL + "'",
//         })
//     ],
//
//     module: {
//
//         //Regeln: Wenn Regex zutrifft => führe Loader (in UMGEKEHRTER) Reihenfolge aus
//         rules: [
//             {
//                 //Kopiert HTML-Dateien in www. Nur die Dateien, welche im JS angefragt werden
//                 test: /index.html$/,
//                 use: [
//                     {
//                         loader: 'html-loader',
//                         options: {
//                             //Sorgt dafür, dass Child-Views funktionieren
//                             attributes: {
//                                 list: [
//                                     {
//                                         "attribute": "data-view",
//                                         "type": "src"
//                                     },
//                                     {
//                                         "attribute": "src",
//                                         "type": "src"
//                                     },
//                                     {
//                                         "attribute": "href",
//                                         "tag": "link",
//                                         "type": "src"
//                                     },
//                                 ],
//                                 urlFilter: (attribute, value, resourcePath) => {
//                                     return !value.endsWith(".js") && !value.endsWith(".css");
//                                 }
//                             }
//                         }
//                     }
//                 ],
//             },
//             {
//                 //Kopiert HTML-Dateien in www. Nur die Dateien, welche im JS angefragt werden
//                 test: /html[\\\/].*\.html$/,
//                 use: [
//                     {
//                         loader: 'file-loader',
//                         options: {
//                             name: '[name].[ext]',
//                             outputPath: 'html'
//                         }
//                     },
//                     {
//                         loader: 'extract-loader'
//                     },
//                     {
//                         loader: 'html-loader',
//                         options: {
//                             //Sorgt dafür, dass Child-Views funktionieren
//                             attributes: {
//                                 list: [
//                                     {
//                                         "attribute": "data-view",
//                                         "type": "src"
//                                     },
//                                     {
//                                         "attribute": "src",
//                                         "type": "src"
//                                     },
//                                     {
//                                         "attribute": "href",
//                                         "tag": "link",
//                                         "type": "src"
//                                     },
//                                 ],
//                             }
//                         }
//                     }
//                 ],
//             },
//             {
//                 test: /\.tsx?$/,
//                 use: ["ts-loader"],
//             },
//             {
//                 //Kopiert nur benutzte Bilder (benutzt durch JS (import), html oder css/sass)
//                 test: /(img|video)[\\\/]/,
//                 use: [
//                     {
//                         loader: 'file-loader',
//                         options: {
//                             name: "[name].[ext]",
//                             outputPath: 'img',
//                             publicPath: function (url, resourcePath, context) {
//                                 return "/img/" + url;
//                             },
//                         }
//                     },
//                 ],
//             },
//             {
//                 //Compiliert SASS zu CSS und speichert es in Datei
//                 test: /\.scss$/,
//                 use: [
//                     {
//                         loader: 'file-loader',
//                         options: {
//                             name: '[name].css',
//                             outputPath: 'css'
//                         }
//                     },
//                     {
//                         loader: 'extract-loader'
//                     },
//                     {
//                         loader: 'css-loader'
//                     },
//                     {
//                         //Compiliert zu CSS
//                         loader: 'sass-loader'
//                     }
//                 ]
//             }
//         ]
//     }
// }
//
//
// //Auslagerung von zeitintensiven Sachen in production only, damit Debugging schneller geht
// if (mode === "production") {
//
//     //Polyfills hinzufügen
//     moduleExports["entry"].unshift("@babel/polyfill");
//
//     //Transpilieren zu ES5
//     moduleExports["module"]["rules"].push({
//         test: /\.m?js$/,
//         exclude: /node_modules\/(?!(cordova-sites|js-helper|cs-event-manager))/,
//         use: {
//             loader: 'babel-loader',
//             options: {
//                 presets: ['@babel/preset-env'],
//                 inputSourceMap: "inline",
//                 sourceMaps: true
//             }
//         }
//     });
//
//     moduleExports["module"]["rules"][1]["use"].unshift({
//         loader: 'babel-loader',
//         options: {
//             presets: ['@babel/preset-env'],
//             inputSourceMap: "inline",
//             sourceMaps: true
//
//         }
//     });
//
//     //Hinzufügen von POSTCSS und Autoprefixer für alte css-Präfixe
//     moduleExports["module"]["rules"][3]["use"].splice(3, 0, {
//         //PostCSS ist nicht wichtig, autoprefixer schon. Fügt Präfixes hinzu (Bsp.: -webkit), wo diese benötigt werden
//         loader: 'postcss-loader',
//         options: {
//             plugins: [require('autoprefixer')()]
//         }
//     });
// }
//
// module.exports = moduleExports;