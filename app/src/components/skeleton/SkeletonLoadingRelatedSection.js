import {Fragment} from "react";
import {SkeletonChildrenFactory} from "./SkeletonLoadingComponent";

export const SkeletonLoadingRelatedSection = (
    <Fragment>
        {SkeletonChildrenFactory('header', 'sm')}
        <div className="tags">
            {SkeletonChildrenFactory('tag', 3)}
        </div>
        {SkeletonChildrenFactory('header', 'sm')}
        <div className="tags">
            {SkeletonChildrenFactory('tag', 3)}
        </div>
        {SkeletonChildrenFactory('header', 'sm')}
        {SkeletonChildrenFactory('result', 4)}
    </Fragment>
)