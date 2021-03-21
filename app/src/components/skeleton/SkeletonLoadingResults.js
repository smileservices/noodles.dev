import {SkeletonChildrenFactory} from "./SkeletonLoadingComponent";

export const SkeletonLoadingResults = (
    <div className="resources">
        <div className="filters">
            {SkeletonChildrenFactory('filter', 3)}
        </div>
        <div className="most-voted">
            {SkeletonChildrenFactory('header', 'md')}
            <div className="results">
                {SkeletonChildrenFactory('result', 5)}
            </div>
        </div>
    </div>
)