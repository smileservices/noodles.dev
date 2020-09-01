import React, {Fragment} from "react"
import StarRating from "../../src/components/StarRating";

export default function ResourceRating({rating, maxRating, reviewsCount}) {
    return (
        <Fragment>
            <span><StarRating maxRating={maxRating} rating={rating}/></span>
            {rating
                ? <Fragment>
                <span>
                    <span itemProp="ratingValue">{rating.toFixed(1)}</span>/<span
                    itemProp="bestRating">{maxRating}</span>
                </span>
                    <span>
                    (<span itemProp="ratingCount">{reviewsCount}</span> reviews)
                </span>
                </Fragment>
                : 'not rated'
            }
        </Fragment>
    )
}