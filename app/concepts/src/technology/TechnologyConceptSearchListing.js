import React from "react";
import TruncatedTextComponent from "../../../src/components/TruncatedTextComponent";

export default function TechnologyConceptSearchListing({data, addFilter}) {
    return (
        <div className="result card concept">
            <header>
                <div className="right">
                    <h4 className="title"><a href={data.url}>{data.name} ({data.technology})</a></h4>
                </div>
                <div className="tags">
                    <span>{data.experience_level}</span>
                    {data.parent ? <span className="concept">{data.parent}</span> : ''}
                </div>
            </header>
            <div className="description">
                <TruncatedTextComponent fullText={data.description} charLimit={250}/>
            </div>
        </div>
    )
}