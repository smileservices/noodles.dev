import React, {useEffect, useState, Fragment} from "react";
import ReactDOM from "react-dom";
import ProblemForm from "./ProblemForm";
import CreateableFormComponent from "../../../src/components/CreateableFormComponent";

function Content() {

    return (
       <div className="form-container full-page-sm">
           <CreateableFormComponent
                endpoint={RESOURCE_API}
                FormViewComponent={ProblemForm}
                successCallback={()=>{}}
                data={{}}
                extraData={{}}
           />
        </div>
    )
}

ReactDOM.render(<Content/>, document.getElementById('create-app'));