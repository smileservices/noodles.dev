import {SkeletonChildrenFactory} from "./SkeletonLoadingComponent";

export const SkeletonLoadingReviews = (
    <div className="column-container">
        {SkeletonChildrenFactory('review', 4)}
    </div>
)