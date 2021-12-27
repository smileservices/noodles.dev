import React from "react";
import { shortenText } from '../../../frontend/src/utils/strings';

export default function CategoryConceptSearchListing({data, addFilter}) {
    return (
        <div className="technology-concepts-card">
            <header>
                <div className="tags">
                    <span>{data.category}</span>
                    <span>{data.experience_level}</span>
                    {data.parent ? <span className="concept">{data.parent}</span> : ''}
                </div>
                <a href={data.url} className="name">{data.name}</a>
            </header>
            <div className="description">
                {shortenText(data.description, 0, 85)}...
            </div>
        </div>
    )
}