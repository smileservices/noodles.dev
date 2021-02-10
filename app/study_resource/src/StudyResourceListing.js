import React, {Fragment, useState} from "react";
import FormatDate from "../../src/vanilla/date";
import Waiting from "../../src/components/Waiting";
import ResourceRating from "./ResourceRating";

export default function StudyResourceListing({data, addFilter}) {
    const MAX_RATING = 5
    return (
        <div className="result resource">
            <p className="rating">
                <ResourceRating rating={data.rating} maxRating={MAX_RATING} reviewsCount={data.reviews_count}/>
            </p>
            <p className="title">
                <a href={data.url} target="new">{data.name}</a>
            </p>
            <div className="group-muted">
                <p className="publication-date">{FormatDate(data.publication_date, 'date')}</p>
                    <p className="experience-level">Difficulty {data.experience_level_label}</p>
                <p className="type">{data.price_label} {data.media_label}</p>
            </div>

            <p className="tags">
                {data.tags.map(t => <span key={'tag' + t} onClick={e=>addFilter('tags', t)} className="tag">{t}</span>)}
                {data.technologies.map(t => <a key={t.url} onClick={e=>addFilter('tech_v', t.name)} className="tech">{t.name} {t.version}</a>)}
            </p>
        </div>
    )
}