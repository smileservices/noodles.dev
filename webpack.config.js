module.exports = {
    entry: {
        '/frontend/static/frontend/homepage': './app/frontend/src/Homepage.js',
        '/dashboard/static/dashboard/dashboard': './app/dashboard/src/Dashboard.js',
    },
    output:{
        filename: '[name].js',
        path: __dirname +'/app/'
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