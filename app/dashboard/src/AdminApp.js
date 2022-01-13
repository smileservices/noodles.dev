import React, {useState, useEffect, Fragment} from 'react';
import ReactDOM from 'react-dom';
import LatestActivityComponent from './components/LatestActivityComponent';


function AdminApp() {

    return (
        <Fragment>
            <LatestActivityComponent/>
        </Fragment>
    )
}

ReactDOM.render(<AdminApp/>, document.getElementById('admin-dashboard-app'));