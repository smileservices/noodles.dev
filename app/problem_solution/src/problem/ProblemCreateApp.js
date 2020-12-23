import React, {useEffect, useState, Fragment} from "react";
import ReactDOM from "react-dom";
import Alert from "../../../src/components/Alert";
import apiCreate from "../../../src/api_interface/apiCreate";
import ProblemForm from "./ProblemForm";
import CreateableFormComponent from "../../../src/components/CreateableFormComponent";
import {makeId} from "../../../src/components/utils";

function Content() {

    return (
       <div className="form-container full-page-sm">
           <CreateableFormComponent
                endpoint={PROBLEM_ENDPOINT}
                FormViewComponent={ProblemForm}
                successCallback={()=>{}}
                data={{}}
                extraData={{}}
           />
        </div>
    )
}

ReactDOM.render(<Content/>, document.getElementById('create-app'));