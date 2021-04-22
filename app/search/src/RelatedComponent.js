import React, {useState, useEffect, Fragment} from "react";
import StudyResourceSearchListing from "../../study_resource/src/StudyResourceSearchListing";
import {SkeletonLoadingRelatedSection} from "../../src/components/skeleton/SkeletonLoadingRelatedSection";

const flagIcon = (
    <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M9.50198 4.5L11.002 1H2.00198V0.5C2.00198 0.224 1.77798 0 1.50198 0C1.22598 0 1.00198 0.224 1.00198 0.5V11.5C1.00198 11.776 1.22598 12 1.50198 12C1.77798 12 2.00198 11.776 2.00198 11.5V8H11.002L9.50198 4.5Z"
            fill="black"/>
    </svg>);

export default function RelatedComponent() {
    const [data, setData] = useState({});
    const [waiting, setWaiting] = useState(true);

    useEffect(e => {
        fetch('/search/api/related/', {
            method: 'GET',
        }).then(result => {
            setWaiting(false);
            if (result.ok) {
                return result.json();
            }
        }).then(data => {
            setData(data);
        })
    }, [])

    if (waiting || Object.keys(data).length === 0) return SkeletonLoadingRelatedSection;
    return (
        <Fragment>
            {Object.keys(data.aggregations.technologies).length ?
                <Fragment>
                    <h4>Popular Technologies</h4>
                    <div className="tags">
                        {Object.keys(data.aggregations.technologies).map(tech =>
                            <a key={'popular-tech-'+tech} className="tech" href={'/search/?tab=resources&tech_v='+tech}>
                                {flagIcon} {tech} ({data.aggregations.technologies[tech]})
                            </a>
                        )}
                    </div>
                </Fragment>
                : ''
            }
            {Object.keys(data.aggregations.tags).length ?
                <Fragment>
                    <h4>Tags to follow</h4>
                    <div className="tags">
                        {Object.keys(data.aggregations.tags).map(tag =>
                            <a key={'popular-tag-'+tag} href={'/search/?tab=resources&tags='+tag}>
                                # {tag} ({data.aggregations.tags[tag]})
                            </a>
                        )}
                    </div>
                </Fragment>
                : ''
            }
            <h4>Latest Added Resources</h4>
            {data.resources.items.map(resource => <StudyResourceSearchListing key={'latest-resource-'+resource.pk} data={resource}/>)}
        </Fragment>
    )
}