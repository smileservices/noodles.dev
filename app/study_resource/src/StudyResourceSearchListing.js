import React, {Fragment, useState} from "react";
import ResourceRating from "./ResourceRating";
import TruncatedTextComponent from "../../src/components/TruncatedTextComponent";

const flagIcon = (<svg width="9" height="10" viewBox="0 0 9 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.02696 4.82843L6.06618 2.72059L8.02696 0.612745C8.125 0.502451 8.14951 0.343137 8.10049 0.220588C8.03922 0.0857843 7.90441 0 7.75735 0H0.367647C0.159314 0 0 0.159314 0 0.367647V9.63235C0 9.84069 0.159314 10 0.367647 10C0.57598 10 0.735294 9.84069 0.735294 9.63235V5.44118H7.75735C7.96569 5.44118 8.125 5.26961 8.125 5.07353C8.125 4.98774 8.08824 4.90196 8.02696 4.82843Z"
                              fill="#1752EA"/>
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