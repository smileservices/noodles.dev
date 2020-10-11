module.exports = {
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
    },
    entry: {
        // just create the react-bundle once

        //for dev
        // 'static/js/react-bundle': ['./app/static/js/react.development.js', './app/static/js/react-dom.development.js'],

        //for prod
        // 'static/js/react-bundle': ['./app/static/js/react.min.js', './app/static/js/react-dom.min.js'],

        // '/static/study_resource/study-resource-detail-reviews': './app/study_resource/src/StudyResourceDetailReviews.js',
        // '/static/study_resource/study-resource-create': './app/study_resource/src/create/StudyResourceCreate.js',
        // '/static/study_resource/study-resource-edit': './app/study_resource/src/edit/StudyResourceEdit.js',
        // '/static/study_resource/user-collections': './app/study_resource/src/collections/UserCollections.js',
        // '/static/problem_solution/problem-create': './app/problem_solution/src/problem/ProblemCreate.js',
        '/static/problem_solution/create-solution-modal': './app/problem_solution/src/solution/CreateSolutionModal.js',
        '/static/problem_solution/problem-children-tree': './app/problem_solution/src/problem/ChildrenTree.js',
        '/static/problem_solution/solution-children-tree': './app/problem_solution/src/solution/ChildrenTree.js',
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/app/'
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