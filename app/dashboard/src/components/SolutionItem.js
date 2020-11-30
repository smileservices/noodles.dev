import React, {Fragment} from "react"

export default function SolutionItem({data}) {
    return (
        <div className="card result solution">
            <h2 className="title"><a href={data.absolute_url}>{data.name}</a></h2>
            <p>solution for <a href={data.parent.absolute_url}>{data.parent.name}</a></p>
            <p>{data.description}</p>
            <p className="tags">
                {data.tags.map(t => <span className="tag">{t['label']}</span>)}
                {data.technologies.map(t => <span className="tech">{t['label']}</span>)}
            </p>
            {data.problems.length > 0 ?
                <Fragment>
                    <p>Problems:</p>
                    <ul>
                        {data.problems.map(pb => (
                            <li key={"problem-" + pb.pk}><a href={pb.absolute_url}>{pb.name}</a></li>
                        ))}
                    </ul>
                </Fragment>
                : ''
            }
        </div>
    )
}