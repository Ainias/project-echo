const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require("path");

let mode = "development";
// let mode = "production";

let moduleExports = {

    //Development oder production, wird oben durch Variable angegeben (damit später per IF überprüft)
    mode: mode,

    //Beinhaltet den JS-Startpunkt und SCSS-Startpunkt
    entry: [__dirname + "/client/js/script.js", __dirname + "/client/sass/index.scss"],

    //Gibt Ausgabename und Ort für JS-File an
    output: {
        path: path.resolve(__dirname, 'www'),
        filename: 'bundle.js'
    },

    plugins: [
        //Delete www before every Build (to only have nessesary files)
        new CleanWebpackPlugin(["www/*"], {exclude: [".gitkeep"]}),

        //Erstellt (kopiert) die Index.html
        new HtmlWebpackPlugin({
            template: '!!html-loader!client/index.html'
        }),
    ],

    module: {

        //Regeln: Wenn Regex zutrifft => führe Loader (in UMGEKEHRTER) Reihenfolge aus
        rules: [
            {
                //Kopiert HTML-Dateien in www. Nur die Dateien, welche im JS angefragt werden
                test: /html[\\\/].*\.html$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'html'
                        }
                    },
                    {
                        loader: 'extract-loader'
                    },
                    {
                        loader: 'html-loader',
                        options: {
                            //Sorgt dafür, dass Child-Views funktionieren
                            attrs: [
                                ":data-view",
                                "img:src",
                            ]
                        }
                    }
                ],
            },
            {
                //Kopiert nur benutzte Bilder (benutzt durch JS (import), html oder css/sass)
                test: /img[\\\/]/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'img',
                            publicPath: 'img'
                            // useRelativePath: true
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
                            outputPath: ''
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

    //Polyfills hinzufügen
    moduleExports["entry"].unshift("@babel/polyfill");

    //Transpilieren zu ES5
    moduleExports["module"]["rules"].push({
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env'],
            }
        }
    });

    //Hinzufügen von POSTCSS und Autoprefixer für alte css-Präfixe
    moduleExports["module"]["rules"][2]["use"].splice(3, 0, {
        //PostCSS ist nicht wichtig, autoprefixer schon. Fügt Präfixes hinzu (Bsp.: -webkit), wo diese benötigt werden
        loader: 'postcss-loader',
        options: {
            plugins: [require('autoprefixer')({
                browsers: ['last 2 versions', 'ie >= 9', 'android >= 4.4', 'ios >= 7']
            })]
        }
    });
}

module.exports = moduleExports;