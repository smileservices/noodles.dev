import React from "react";
import { shortenText } from '../../../frontend/src/utils/strings';

export default function TechnologyConceptSearchListing({data, addFilter}) {
    return (
        <div className="technology-concepts-card">
            <header>
                <div className="tags">
                    <span>{data.experience_level}</span>
                    {data.parent ? <span className="concept">{data.parent}</span> : ''}
                </div>
                <a href={data.url} className="name">{data.name} ({data.technology})</a>
            </header>
            <div className="description">
                {shortenText(data.description, 0, 85)}...
            </div>
        </div>
    )
}