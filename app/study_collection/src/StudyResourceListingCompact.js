import React, {Fragment, useState} from "react";
import FormatDate from "../../src/vanilla/date";
import ResourceRating from "../../study_resource/src/ResourceRating";

export default function StudyResourceListingCompact({data, remove}) {
    return (
        <div className="resource">
            <p className="rating">
                <ResourceRating rating={data.rating} maxRating={MAX_RATING} reviewsCount={data.reviews_count}/>
            </p>
            <p className="title">
                <a href={data.absolute_url} target="new">{data.name}</a>
            </p>
            <a href="" onClick={e=> {e.preventDefault(); remove()} }>remove</a>
        </div>
    )
}