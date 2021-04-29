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
        'static/js/react-bundle': ['./app/static/js/react.min.js', './app/static/js/react-dom.min.js'],

        //homepage
        '/static/homepage-app': './app/frontend/src/HomepageApp.js',

        //study resource related
        '/static/study_resource/study-resource-detail-reviews': './app/study_resource/src/StudyResourceDetailReviews.js',
        '/static/study_resource/study-resource-create': './app/study_resource/src/create/StudyResourceCreate.js',
        '/static/study_resource/detail-toolbar': './app/study_resource/src/detail/ToolbarApp.js',
        '/static/study_resource/study-resource-edit': './app/study_resource/src/EditApp.js',
        '/static/my-study-resources': './app/study_resource/src/MyResourcesApp.js',

        //study resource collections
        '/static/my-study-collections': './app/study_collection/src/MyCollectionsApp.js',

        //technology
        '/static/technology/technology-create': './app/technology/src/TechCreateApp.js',
        '/static/technology/my-technologies-app': './app/technology/src/MyTechnologiesApp.js',

        //vote app
        '/static/votes': './app/src/core/VotesApp.js',

        //search app
        '/static/navbar-search-bar-app': './app/search/src/NavbarSearchBarApp.js',
        '/static/search-app': './app/search/src/SearchApp.js',
        '/static/minimal-search-app': './app/search/src/MinimalSearchApp.js',

        //edit suggestions
        '/static/technology/edit': './app/technology/src/EditApp.js',
        '/static/study_resource/edit': './app/study_resource/src/EditApp.js',

        //sidebar
        '/static/frontend/sidebar-app': './app/frontend/src/sidebar/SidebarApp.js',

        //related section
        '/static/related-app': './app/frontend/src/RelatedApp.js',

        //users
        '/static/profile-app': './app/users/src/ProfileApp.js',

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