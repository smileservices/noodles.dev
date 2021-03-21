import {SkeletonChildrenFactory} from "./SkeletonLoadingComponent";

export const SkeletonLoadingResults = (
    <div className="skeleton links">
        {SkeletonChildrenFactory('sidebar-tech', 14)}
    </div>
)