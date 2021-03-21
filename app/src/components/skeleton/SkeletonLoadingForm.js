import {SkeletonChildrenFactory} from "./SkeletonLoadingComponent";

export const SkeletonLoadingForm = (
    <div>
        {SkeletonChildrenFactory('result', 5)}
    </div>
);