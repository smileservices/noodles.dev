import {SkeletonChildrenFactory} from "./SkeletonLoadingComponent";

export const SkeletonLoadingCollections = (
    <div className="results">
        {SkeletonChildrenFactory('result', 5)}
    </div>
)