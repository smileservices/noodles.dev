module.exports = {
    entry: {
        homepage: './app/frontend/src/Homepage.js'
    },
    output:{
        filename: '[name].js',
        path: __dirname +'/app/frontend/static/frontend/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    }
};