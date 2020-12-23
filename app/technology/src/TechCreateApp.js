import React, {useEffect, useState, Fragment} from "react";
import ReactDOM from "react-dom";
import CreateableFormComponent from "../../src/components/CreateableFormComponent";
import TechForm from "./TechForm";

function Content() {

    return (
       <div className="form-container full-page-sm">
           <CreateableFormComponent
                endpoint={TECH_ENDPOINT}
                FormViewComponent={TechForm}
                successCallback={()=>{}}
                data={{}}
                extraData={{}}
           />
        </div>
    )
}

ReactDOM.render(<Content/>, document.getElementById('create-app'));