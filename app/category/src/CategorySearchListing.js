import React from "react";

export default function CategorySearchListing({data, addFilter}) {
    return (
        <div className="category-card">
            <header>
                <a href={data.url}>{data.name}</a>
                {/*<div>
                        <span>{data.parent}</span>
                </div>*/}
            </header>
            <p>{data.description}</p>
        </div>
    )
}