import React, {useState, Fragment} from "react";
import FormatDate from "../../src/vanilla/date";

export default function CollectionSearchListing({data, addFilter}) {

    return (
        <div className="result card">
            <p className="title"><a href={data.url}>{data.name}</a></p>
            <div className="group-muted">
                <div className="row">
                    <span className="date">Created on {FormatDate(data.created_at, 'date')}</span>
                </div>
                <p className="summary">{data.description}</p>
                <p>has {data.items_count} items</p>
            </div>
            <span className="tags">
                {data.tags.map(t => <span key={'tag' + t} onClick={e => addFilter('tags', t)}
                                          className="tag">{t}</span>)}
                {data.technologies.map(t => <a key={data.pk + t} onClick={e => addFilter('technologies', t)}
                                               className="tech">{t}</a>)}
            </span>
            <div className="thumbs">
                <div>is public</div>
                <div className="down"><span
                    className="icon-thumbs-o-down"> </span><span>{data.thumbs_down}</span></div>
                <div className="up"><span className="icon-thumbs-o-up"> </span><span>{data.thumbs_up}</span>
                </div>
            </div>
        </div>
    )
}