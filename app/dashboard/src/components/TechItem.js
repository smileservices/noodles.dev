import React, {Fragment} from "react"

export default function TechItem({data}) {
    return (
        <div className="card result problem">
            <h2 className="title">{data.name} {data.version ? data.version : ''}</h2>
            <p>{data.description}</p>
        </div>
    )
}