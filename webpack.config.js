/**
 * Created by zhengsl on 2017/2/7.
 */
var path = require('path');
module.exports = {
    entry: "./es6/main.js",
    output: {
        path: __dirname,
        filename: "build/[name].min.js"
    },
    module: {
        loaders: [
            {
                test: path.join(__dirname, 'es6'),
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
}