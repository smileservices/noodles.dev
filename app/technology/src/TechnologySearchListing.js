import React, {useState, Fragment} from "react";
import FormatDate from "../../src/vanilla/date";

export default function TechnologySearchListing({data, addFilter}) {

    return (
        <div className="result card">
            <p className="title"><a href={data.url}>{data.name}</a></p>
            <p className="owner">{data.owner}</p>
            <div className="group-muted">
                <p className="summary">{data.description}</p>
            </div>
            <p className="summary">{data.category}</p>
            <span className="tags">
                {data.ecosystem.map(t => <a key={data.pk + t} onClick={e => addFilter('ecosystem', t)}
                                               className="tech">{t}</a>)}
            </span>
            <div className="thumbs">
                <div className="down"><span className="icon-thumbs-o-down"> </span><span>{data.thumbs_down}</span></div>
                <div className="up"><span className="icon-thumbs-o-up"> </span><span>{data.thumbs_up}</span>
                </div>
            </div>
        </div>
    )
}