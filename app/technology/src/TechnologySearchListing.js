import React from "react";
import { shortenText } from '../../frontend/src/utils/strings';

export default function TechnologySearchListing({data, addFilter}) {
    return (
        <div className="technology-card">
            <header>
                <img src={data.logo.medium} alt=""/>
                <h4 className="title"><a href={data.url}>{data.name}</a></h4>
            </header>
            <div className="description">
                {shortenText(data.description, 0, 85)}...
            </div>
            {/*{data.ecosystem.length ?
                <span className="tags">
                    <span>Ecosystem: </span>
                    {data.ecosystem.map(t => <a key={'tech' + t} className="tech"
                                                   onClick={e => addFilter('ecosystem', t)}>{t}</a>)}
                </span>
            : ''}*/}
            <div className="tags">
                <span onClick={e=>addFilter('license', data.license)}>{data.license}</span>
                {data.category.map(cat=><span onClick={e=>addFilter('category', cat)}>{cat}</span>)}
            </div>
            <div className="thumbs">
                <div className="up"><span className="icon-thumbs-o-up"> </span><span>{data.thumbs_up}</span></div>
                <div className="down"><span className="icon-thumbs-o-down"> </span><span>{data.thumbs_down}</span></div>
            </div>
        </div>
    )
}