module.exports = {
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
    },
    entry: {
        // just create the react-bundle once
        // 'static/js/react-bundle': ['./app/static/js/react.min.js', './app/static/js/react-dom.min.js'],
        // 'static/js/react-bundle': ['./app/static/js/react.development.js', './app/static/js/react-dom.development.js'],
        '/static/study_resource/study-resource-detail-reviews': './app/study_resource/src/StudyResourceDetailReviews.js',
        '/static/study_resource/study-resource-create': './app/study_resource/src/StudyResourceCreate.js',
        '/static/study_resource/study-resource-edit': './app/study_resource/src/StudyResourceEdit.js',
    },
    output: {
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