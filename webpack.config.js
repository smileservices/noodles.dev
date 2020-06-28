module.exports = {
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
    },
    entry: {
        // just create the react-bundle once
        // 'static/js/react-bundle': ['./app/static/js/react.min.js', './app/static/js/react-dom.min.js'],
        '/frontend/static/frontend/homepage': './app/frontend/src/homepage/App.js',
        '/dashboard/static/dashboard/dashboard': './app/dashboard/src/dashboard/App.js',
        '/dashboard/static/dashboard/account_settings': './app/dashboard/src/account/App.js',
        '/simplecrud/static/simplecrud/simplecrud-admin': './app/simplecrud/src/admin/App.js',
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