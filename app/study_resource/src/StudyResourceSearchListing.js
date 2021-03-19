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
    return (
            <div className="card">
                <div className="result resource">
                    <div className="left">
                        <div className="tags">
                            {data.technologies.map(t => <a key={t.url} href={t.url}
                                                           className="tech">{flagIcon} {t.name} {t.version}</a>)}
                            <span onClick={e => {addFilter('category', data.category)}}>{data.category}</span>
                            <span
                                onClick={e => addFilter('experience_level', data.experience_level)}>{data.experience_level}</span>
                        </div>
                        <div className="listing-title">
                            <h4 className="title" itemProp="name"><a href={data.url}>{data.name}</a></h4>
                            <span className="published">{data.publication_date} By {data.published_by}</span>
                            <div className="tags">
                                <span onClick={e => addFilter('media', data.media)}>{data.media}</span>
                            </div>
                        </div>
                        <div className="description">
                            <TruncatedTextComponent fullText={data.summary} charLimit={250}/>
                        </div>
                        <div className="tags">
                            {data.tags.map(t => <span key={'tag' + t} onClick={e => addFilter('tags', t)}
                                                      className="tag">#{t}</span>)}
                        </div>
                        <ResourceRating data={data} maxRating={MAX_RATING}/>
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