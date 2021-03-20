import React, {Fragment, useState} from "react";
import FormatDate from "../../src/vanilla/date";
import ResourceRating from "../../study_resource/src/ResourceRating";

export default function StudyResourceListingCompact({data, remove}) {
    return (
        <Fragment>
            <p className="title">
                <a href={data.absolute_url} target="new">{data.name}</a>
            </p>
            <ResourceRating data={data} maxRating={MAX_RATING}/>
            <span className="remove" onClick={e => {
                e.preventDefault();
                remove()
            }}>
                <span className="icon-cancel"/>
            </span>
        </Fragment>
    )
}