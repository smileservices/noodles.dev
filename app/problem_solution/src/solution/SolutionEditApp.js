import React, {useEffect, useState, Fragment} from "react";
import ReactDOM from "react-dom";
import SolutionForm from "./SolutionForm";
import EditableComponent from "../../../src/components/EditableComponent";
import {makeId} from "../../../src/components/utils";
import Alert from "../../../src/components/Alert";

function SolutionEditApp() {

    const [solutionData, setSolutionData] = useState(getSolutionData(RESULT))
    const [deleted, setDeleted] = useState(false);

    function DisplayViewComponent({data, waiting}) {
        return (
            <Fragment>
                <h1 className="title" itemProp="name">
                    {data.name}
                </h1>
                {data.parent_element ?
                    <p className="">solution of <a key={makeId(5)}
                                                   href={data.parent_element.absolute_url}>{data.parent_element.name}</a></p>
                    : ''}
                <p className="summary" itemProp="abstract">{data.description}</p>
                <div className="tags" itemProp="keywords">
                    <span>Tags: </span>
                    {data.tags.map(tag => <a key={makeId(5)} className="tag" href="">{tag.label}</a>)}
                    <span>Technologies: </span>
                    {data.technologies.map(tech => <a key={makeId(5)} className="tech" href="">{tech.label}</a>)}
                </div>
            </Fragment>
        )
    }

    function getSolutionData(source) {
        let data = source;
        if (data.parent && data.parent['pk']) {
            data.parent_element = data.parent
        }
        data.parent = data.parent_element.pk;
        return data
    }

    if (deleted) return (<Alert text="Solution has been deleted" type="info"/>);
    return (
        <EditableComponent
            endpoint={SOLUTION_ENDPOINT}
            data={solutionData}
            extraData={{}}
            DisplayViewComponent={DisplayViewComponent}
            FormViewComponent={SolutionForm}
            updateCallback={data => setSolutionData(getSolutionData(data))}
            deleteCallback={() => setDeleted(true)}
        />
    )
}

ReactDOM.render(<SolutionEditApp/>, document.getElementById('detail'));