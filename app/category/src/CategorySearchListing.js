import React from "react";

export default function CategorySearchListing({data, addFilter}) {
    return (
        <div className="card">
        <div className="result category">
            <div className="listing-title">
                <div className="title"><a href={data.url}>{data.name}</a></div>
            </div>
            <p className="description">{data.description}</p>
        </div>
        </div>
    )
}