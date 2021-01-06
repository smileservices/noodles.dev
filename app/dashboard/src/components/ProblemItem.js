import React, {Fragment} from "react"

export default function ProblemItem({data}) {
    return (
        <div className="card result problem">
            <h2 className="title"><a href={data.absolute_url}>{data.name}</a></h2>
            <p>{data.description}</p>
            <p className="tags">
                {data.tags.map(t => <span className="tag">{t['label']}</span>)}
            </p>
            {data.solutions.length > 0 ?
                <Fragment>
                    <p>Solutions:</p>
                    <ul>
                        {data.solutions.map(pb => (
                            <li key={"solution-"+pb.pk}><a href={pb.absolute_url}>{pb.name}</a></li>
                        ))}
                    </ul>
                </Fragment>
                : ''
            }
        </div>
    )
}