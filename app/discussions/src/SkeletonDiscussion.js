import {SkeletonChildrenFactory} from "../../src/components/skeleton/SkeletonLoadingComponent";

export const SkeletonLoadingPosts = (count)=>(SkeletonChildrenFactory('post', count));