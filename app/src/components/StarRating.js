import React, {Fragment, useEffect, useState} from "react";

export default function StarRating({rating, maxRating, ratingChange, isDisabled}) {

    let starsArr = []
    for (let r = 1; r <= maxRating; r++) {
        const className =  r <= rating ? 'icon-star-full' :  'icon-star-empty';
        starsArr.push((
            <span key={'rating-star' + r} className={className} onClick={ratingChange && !isDisabled ? e => ratingChange(r) : null}/>
            ))
    }

    return (
        <Fragment>
            {starsArr.map(starEl => starEl)}
        </Fragment>
    )
}