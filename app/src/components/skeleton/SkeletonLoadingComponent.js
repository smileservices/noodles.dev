import React from "react";
import {makeId} from "../utils";

const SkeletonFilter = () => (<div className="skeleton filter-select"/>);
const SkeletonResult = () => (<div className="skeleton result"/>);
const SkeletonReview = () => (<div className="skeleton review"/>);
const SkeletonTag = () => (<span className="skeleton tag"/>);
const SkeletonSidebarTech = () => (<span />);
const SkeletonHeader = ({size}) => (<div className={'skeleton header '+size} />)

export function SkeletonChildrenFactory(name, count) {
    let Element = '';
    switch (name) {
        case 'filter':
            Element = SkeletonFilter;
            break;
        case 'result':
            Element = SkeletonResult;
            break;
        case 'review':
            Element = SkeletonReview;
            break;
        case 'tag':
            Element = SkeletonTag;
            break;
        case 'header':
            // count this time is string
            return [<SkeletonHeader key={makeId(4)} size={count} />,];
        case 'sidebar-tech':
            Element = SkeletonSidebarTech;
            break;
        default:
            alert('Cannot find Skeleton Element of name '+name);
    }
    let resultList = [];
    var i = 0;
    do {
        resultList.push(<Element key={makeId(4)}/>);
        i += 1;
    } while (i < count);
    return resultList;
}

export default function SkeletonLoadingComponent({element}) {

    return (
        <div className='skeleton-loading-container'>
            {element}
        </div>
    );
}