import React from "react";
import FormatDate from "../../src/vanilla/date";
import TruncatedTextComponent from "../../src/components/TruncatedTextComponent";

export default function TechnologySearchListing({data, addFilter}) {
    return (
        <div className="result card technology">
            <header>
                <div className="logo">
                    <img src={data.logo.medium} alt=""/>
                </div>
                <div className="right">
                    <h4 className="title"><a href={data.url}>{data.name}</a></h4>
                    <div className="tags">
                        <span onClick={e=>addFilter('license', data.license)}>{data.license}</span>
                        <span onClick={e=>addFilter('category', data.category)}>{data.category}</span>
                    </div>
                </div>
            </header>
            <div className="description">
                <TruncatedTextComponent fullText={data.description} charLimit={250} />
            </div>
            {data.ecosystem.length ?
                <span className="tags">
                    <span>Ecosystem: </span>
                    {data.ecosystem.map(t => <a key={'tech' + t} className="tech"
                                                   onClick={e => addFilter('ecosystem', t)}>{t}</a>)}
                </span>
                : ''}
            <div className="thumbs">
                <div className="down"><span className="icon-thumbs-o-down"> </span><span>{data.thumbs_down}</span></div>
                <div className="up"><span className="icon-thumbs-o-up"> </span><span>{data.thumbs_up}</span></div>
            </div>
        </div>
    )
}