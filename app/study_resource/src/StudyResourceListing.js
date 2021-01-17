import React, {Fragment, useState} from "react";
import FormatDate from "../../src/vanilla/date";
import Waiting from "../../src/components/Waiting";
import ResourceRating from "./ResourceRating";

export default function StudyResourceListing({data, remove}) {
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
                    <p className="experience-level">Difficulty {data.experience_level}</p>
                <p className="type">{data.price} {data.media}</p>
            </div>

            <p className="tags">
                {data.tags.map(t => <span key={'tag' + t.value} className="tag">{t.label}</span>)}
                {data.technologies.map(t => <a key={'tech' + t.pk} href={t.url} className="tech">{t.name} {t.version}</a>)}
            </p>
        </div>
    )
}