import React, {Fragment, useState} from "react";
import ResourceRating from "./ResourceRating";
import TruncatedTextComponent from "../../src/components/TruncatedTextComponent";

const flagIcon = (
    <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M9.50198 4.5L11.002 1H2.00198V0.5C2.00198 0.224 1.77798 0 1.50198 0C1.22598 0 1.00198 0.224 1.00198 0.5V11.5C1.00198 11.776 1.22598 12 1.50198 12C1.77798 12 2.00198 11.776 2.00198 11.5V8H11.002L9.50198 4.5Z"
            fill="black"/>
    </svg>);

export default function StudyResourceSearchListing({data, addFilter}) {
    const MAX_RATING = 5

    const technologies = data.technologies.map(t => <a key={t.url} href={t.url} className="tech">{flagIcon} {t.name}{t.version ? ' '+t.version : ''}</a>);
    const concepts = {
        category: data.category_concepts.map(c=> <a href={c.url} className="concept">{c.name}</a>),
        technology: data.technology_concepts.map(c=> <a href={c.url} className="concept">{c.name}</a>),
    }
    const category = addFilter
        ? (<span onClick={e => {addFilter('category', data.category)}}>{data.category}</span>)
        : (<a key={'cat' + data.media} href={'/search?tab=resources&category='+data.category}>{data.category}</a>)
    const experience_level = addFilter
        ? (<span onClick={e => addFilter('experience_level', data.experience_level)}>{data.experience_level}</span>)
        : (<a key={'exp' + data.experience_level} href={'/search?tab=resources&experience_level='+data.experience_level}>{data.experience_level}</a>)
    const tags = data.tags.map(t=>{
        if (addFilter) return (<span key={'tag' + t} onClick={e => addFilter('tags', t)} className="tag">#{t}</span>);
        return (<a key={'tag' + t} href={'/search?tab=resources&tags='+t}  className="tag">#{t}</a>);
    });
    const media = addFilter
        ? (<span onClick={e => addFilter('media', data.media)}>{data.media}</span>)
        : (<a key={'media' + data.media} href={'/search?tab=resources&media='+data.media}>{data.media}</a>)

    return (
            <div className="resource-card">
                <div className="resource-result">
                    <div className="left">
                        <div className="resource-tags">
                            {technologies}{concepts.technology}{category}{concepts.category}{experience_level}
                        </div>
                        <div className="resource-listing-title">
                            <h4 className="title" itemProp="name"><a href={data.url}>{data.name}</a></h4>
                            <span className="published">{data.publication_date} By {data.published_by}</span>
                            <ResourceRating data={data} maxRating={MAX_RATING}/>
                            {/*<div className="tags">{media}</div>*/}
                        </div>
                        <div className="description">
                            <p>
                                <TruncatedTextComponent fullText={data.summary} charLimit={250}/>
                            </p>
                        </div>
                        <div className="resource-tags bottom">{tags}</div>
                    </div>
                    {data.image ?
                        <div className="right">
                            <div className="image">
                                <a itemProp="name" href={data.url}>
                                    <img className="primary-image" src={data.image.small} alt=""/>
                                </a>
                            </div>
                        </div>
                        : ''}
                </div>
            </div>
    )
}