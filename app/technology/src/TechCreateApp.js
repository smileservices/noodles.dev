import React, {useEffect, useState, Fragment} from "react";
import ReactDOM from "react-dom";
import CreateableFormComponent from "../../src/components/CreateableFormComponent";
import TechForm from "./TechForm";

function Content() {

    const defaultData = {
        'name': '',
        'image_file': {content: '', name: ''},
        'url': '',
        'description': '',
        'pros': '',
        'cons': '',
        'limitations': '',
        'owner': '',
        'category': '',
        'ecosystem': [],
    }

    return (
       <div className="form-container full-page-sm">
           <CreateableFormComponent
                endpoint={TECH_API}
                FormViewComponent={TechForm}
                successCallback={()=>{}}
                data={defaultData}
                extraData={{}}
                contentType={'multipart'}
           />
        </div>
    )
}

ReactDOM.render(<Content/>, document.getElementById('create-app'));