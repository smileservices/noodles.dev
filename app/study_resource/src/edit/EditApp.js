import React, {useState, useEffect, Fragment} from "react"
import ReactDOM from "react-dom";
import Alert from "../../../src/components/Alert";
import DetailStatic from "./DetailStatic";
import EditForm from "./EditForm";

function EditApp() {

    return (
        <Fragment>
            <EditForm />
        </Fragment>
    );
}

ReactDOM.render(<EditApp/>, document.getElementById('edit-app'));