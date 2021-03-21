import {SkeletonChildrenFactory} from "./SkeletonLoadingComponent";

export const SkeletonLoadingSidebar = (
    <div className="skeleton links">
        {SkeletonChildrenFactory('sidebar-tech', 14)}
    </div>
)