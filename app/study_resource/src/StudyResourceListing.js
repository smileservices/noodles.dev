import React, {Fragment, useState} from "react";
import FormatDate from "../../src/vanilla/date";
import Waiting from "../../src/components/Waiting";
import ResourceRating from "./ResourceRating";

export default function StudyResourceListing({data, options, remove}) {
    return (
        <div className="result resource">
            <div className="toolbar">
                <span className="icon-close delete" onClick={e => {
                    remove();
                }}/>
            </div>
            <p className="rating">
                <ResourceRating rating={data.rating} maxRating={MAX_RATING} reviewsCount={data.reviews_count}/>
            </p>
            <p className="title">
                <a href={data.absolute_url} target="new">{data.name}</a>
            </p>
            <div className="group-muted">
                <p className="publication-date">{FormatDate(data.publication_date, 'date')} by {data.published_by}</p>
                {!options
                    ? <Waiting text={"Loading options"}/>
                    : <Fragment>
                        <p className="experience-level">Difficulty {options.experience_level.map(opt => {
                            if (opt[0] === data.experience_level) return opt[1];
                        })}</p>
                        <p className="type">
                            {options.type.map(opt => {
                                if (opt[0] === data.price) return opt[1];
                            })} {options.media.map(opt => {
                            if (opt[0] === data.media) return opt[1];
                        })}
                        </p>
                    </Fragment>
                }
            </div>

            <p className="tags">
                {data.tags.map(t => <span key={'tag' + t.pk} className="tag">{t.name}</span>)}
                {data.technologies.map(t => <span key={'tech' + t.pk} className="tech">{t.name}</span>)}
            </p>
        </div>
    )
}