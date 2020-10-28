import React, {useEffect, useState, Fragment} from "react";
import ReactDOM from "react-dom";
import ProblemForm from "./ProblemForm";
import EditableComponent from "../../../src/components/EditableComponent";
import {makeId} from "../../../src/components/utils";
import Alert from "../../../src/components/Alert";
function ProblemEditApp() {

    const [problemData, setProblemData] = useState(getProblemData(RESULT));
    const [deleted, setDeleted] = useState(false);

    function DisplayViewComponent({data, waiting}) {
        return(
            <Fragment>
                <h1 className="title" itemProp="name">
                    {data.name}
                </h1>
                {data.parent_element ?
                <p className="">problem of <a key={makeId(5)} href={ data.parent_element.absolute_url }>{data.parent_element.name}</a></p>
                : ''}
                <p className="summary" itemProp="abstract">{data.description}</p>
                <div className="tags" itemProp="keywords">
                    <span>Tags: </span>
                    {data.tags.map(tag => <a key={makeId(5)} className="tag" href={SEARCH_URL+"?tags="+tag.value}>{tag.label}</a>)}
                </div>
            </Fragment>
        )
    }

    function getProblemData(source) {
        let data = source;
        if (data.parent && data.parent['pk']) {
            data.parent_element = data.parent
        }
        if (data.parent_element) {
            data.parent = data.parent_element.pk;
        } else {
            data.parent = false;
        }
        return data
    }
    if (deleted) return (<Alert text="Problem has been deleted" type="info"/>);
    return (
        <EditableComponent
            endpoint={PROBLEM_ENDPOINT}
            data={problemData}
            extraData={{}}
            DisplayViewComponent={DisplayViewComponent}
            FormViewComponent={ProblemForm}
            updateCallback={data=>setProblemData(getProblemData(data))}
            deleteCallback={()=>setDeleted(true)}
        />
    )
}

ReactDOM.render(<ProblemEditApp/>, document.getElementById('detail'));