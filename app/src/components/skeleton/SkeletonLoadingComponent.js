import React from "react";
import {makeId} from "../utils";

const SkeletonHeader = ({size}) => (<div className={'skeleton header ' + size}/>)

export function SkeletonChildrenFactory(name, count) {
    let Element = '';
    switch (name) {
        case 'filter':
            Element = () => (<div className="skeleton filter-select"/>);
            break;
        case 'result':
            Element = () => (<div className="skeleton result"/>);
            break;
        case 'review':
            Element = () => (<div className="skeleton review"/>);
            break;
        case 'post':
            Element = () => (<div className="skeleton post"/>);
            break;
        case 'tag':
            Element = () => (<span className="skeleton tag"/>);
            break;
        case 'header':
            // count this time is string
            return [<SkeletonHeader key={makeId(4)} size={count}/>,];
        case 'sidebar-tech':
            Element = () => (<div className="result-minimal skeleton"/>);
            break;
        default:
            alert('Cannot find Skeleton Element of name ' + name);
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