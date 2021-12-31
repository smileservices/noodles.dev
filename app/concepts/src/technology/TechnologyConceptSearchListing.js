import React from "react";
import { shortenText } from '../../../frontend/src/utils/strings';

export default function TechnologyConceptSearchListing({data, addFilter}) {
    return (
        <div className="card">
            <div className="result concept-listing">
                <div className="tags">
                    <span>{data.experience_level}</span>
                    {data.parent ? <span className="concept">{data.parent}</span> : ''}
                </div>
                <div className="listing-title">
                    <div className="title"><a href={data.url} className="name">{data.name} ({data.technology})</a></div>
                </div>
                <p className="description">{data.description}</p>
            </div>
        </div>
    )
}