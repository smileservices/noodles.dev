import React from "react"
import StarRating from "../../src/components/StarRating";

export default function ResourceRating({data, maxRating}) {
    if (data.rating) return (
        <div className="rating">
            <span className="stars"><StarRating maxRating={maxRating} rating={data.rating}/></span>
            <span itemProp="ratingCount">{data.reviews_count} Reviews</span>
        </div>
    )
    return (
        <div className="rating">
            <span itemProp="ratingCount">No Reviews Yet. <a href={data.url}>Contribute</a></span>
        </div>
    )
}