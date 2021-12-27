import React from "react";

export default function TechnologyMinimalListing({data}) {
    return (
        <a href={data.url}>
            <div className="technology">
                {data.logo.small ? <img src={data.logo.small} alt=""/> : ''}
                <div className="text">
                    <div className="name">{data.name}</div>
                    <div className="category">{data.category}</div>
                </div>
            </div>
        </a>
    )
}