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

        //study resource related
        // '/static/study_resource/study-resource-detail-reviews': './app/study_resource/src/StudyResourceDetailReviews.js',
        '/static/study_resource/study-resource-create': './app/study_resource/src/create/StudyResourceCreate.js',
        // '/static/study_resource/detail-toolbar': './app/study_resource/src/detail/ToolbarApp.js',
        // '/static/study_resource/study-resource-edit': './app/study_resource/src/edit/StudyResourceEdit.js',
        // '/static/study_resource/user-collections': './app/study_resource/src/collections/UserCollections.js',

        //problem-related
        '/static/problem_solution/problem-create': './app/problem_solution/src/problem/ProblemCreateApp.js',
        '/static/problem_solution/problem-children-tree': './app/problem_solution/src/problem/ChildrenTree.js',
        '/static/problem_solution/solution-create-modal': './app/problem_solution/src/solution/CreateSolutionModalApp.js',

        //solution-related
        '/static/problem_solution/problem-create-modal': './app/problem_solution/src/problem/CreateProblemModalApp.js',
        '/static/problem_solution/solution-children-tree': './app/problem_solution/src/solution/ChildrenTree.js',

        //technology
        '/static/technology/technology-create': './app/technology/src/TechCreateApp.js',

        //vote app
        // '/static/votes': './app/src/core/VotesApp.js',


        //edit suggestions
        // '/static/problem_solution/problem-edit': './app/problem_solution/src/problem/EditApp.js',
        // '/static/problem_solution/solution-edit': './app/problem_solution/src/solution/EditApp.js',
        // '/static/technology/edit': './app/technology/src/EditApp.js',
        // '/static/study_resource/edit': './app/study_resource/src/EditApp.js',

        // admin dashboard
        // '/static/dashboard/admin/dashboard': './app/dashboard/src/main-page/App.js'
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