import React, {useEffect, useState, Fragment} from "react";
import ReactDOM from "react-dom";
import ProblemForm from "./ProblemForm";
import EditableComponent from "../../../src/components/EditableComponent";
import {makeId} from "../../../src/components/utils";

function App() {

    function DisplayViewComponent({data, waiting}) {
        return(
            <Fragment>
                <h1 className="title" itemProp="name">
                    {data.name}
                </h1>
                {data.parent ?
                <p className="">problem of <a key={makeId(5)} href={ data.parent.url }>{data.parent.name}</a></p>
                : ''}
                <p className="summary" itemProp="abstract">{data.description}</p>
                <div className="tags" itemProp="keywords">
                    <span>Tags: </span>
                    {data.tags.map(tag => <a key={makeId(5)} className="tag" href="">{tag.label}</a>)}
                </div>
            </Fragment>
        )
    }

    return (
        <EditableComponent
            endpoint={PROBLEM_ENDPOINT}
            data={RESULT}
            extraData={{}}
            DisplayViewComponent={DisplayViewComponent}
            FormViewComponent={ProblemForm}
            updateCallback={data=>{}}
            deleteCallback={()=>{}}
        />
    )
}

ReactDOM.render(<App/>, document.getElementById('detail'));