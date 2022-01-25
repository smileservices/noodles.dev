module.exports = (env, argv) => ({
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
    },
    entry: {
        // just create the react-bundle once

        //for dev
        'static/js/react-bundle': argv.mode === 'production'
            ? ['./app/static/react_files/react.min.js', './app/static/react_files/react-dom.min.js']
            : ['./app/static/react_files/react.development.js', './app/static/react_files/react-dom.development.js'],

        //homepage
        '/static/js/homepage-app': './app/frontend/src/HomepageApp.js',

        //study resource related
        '/static/js/study_resource/study-resource-detail-reviews': './app/study_resource/src/StudyResourceDetailReviews.js',
        '/static/js/study_resource/study-resource-create': './app/study_resource/src/create/StudyResourceCreate.js',
        '/static/js/study_resource/detail-toolbar': './app/study_resource/src/detail/ToolbarApp.js',
        '/static/js/study_resource/study-resource-edit': './app/study_resource/src/EditApp.js',
        '/static/js/my-study-resources': './app/study_resource/src/MyResourcesApp.js',

        //study resource collections
        '/static/js/my-study-collections': './app/study_collection/src/MyCollectionsApp.js',

        //technology
        '/static/js/technology/technology-create': './app/technology/src/TechCreateApp.js',
        '/static/js/technology/my-technologies-app': './app/technology/src/MyTechnologiesApp.js',

        //concept
        '/static/js/concepts/category/edit': './app/concepts/src/category/EditApp.js',
        '/static/js/concepts/category/create': './app/concepts/src/category/CreateApp.js',
        '/static/js/concepts/technology/edit': './app/concepts/src/technology/EditApp.js',
        '/static/js/concepts/technology/create': './app/concepts/src/technology/CreateApp.js',

        //vote app
        '/static/js/votes': './app/src/core/VotesApp.js',

        //subscribe app
        '/static/js/subscribe': './app/src/core/SubscribeApp.js',

        //search app
        '/static/js/navbar-search-bar-app': './app/search/src/NavbarSearchBarApp.js',
        '/static/js/search-app': './app/search/src/SearchApp.js',
        '/static/js/minimal-search-app': './app/search/src/MinimalSearchApp.js',

        //edit suggestions
        '/static/js/technology/edit': './app/technology/src/EditApp.js',
        '/static/js/study_resource/edit': './app/study_resource/src/EditApp.js',

        //sidebar
        '/static/js/frontend/sidebar-app': './app/frontend/src/sidebar/SidebarApp.js',

        //notifications
        '/static/js/notifications': './app/src/core/NotificationsApp.js',

        //related section
        '/static/js/related-app': './app/frontend/src/RelatedApp.js',

        //users
        '/static/js/profile-app': './app/users/src/ProfileApp.js',

        //history
        '/static/js/resource-history': './app/history/src/ResourceHistoryApp.js',

        // admin dashboard
        '/static/js/dashboard/admin': './app/dashboard/src/AdminApp.js'
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
});