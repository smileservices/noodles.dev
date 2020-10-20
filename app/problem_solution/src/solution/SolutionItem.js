import React, {Fragment} from "react"

export default function SolutionItem({data}) {
    return (
        <div className="card result solution">
            <h2 className="title"><a href={data.absolute_url}>{data.name}</a></h2>
            <p>{data.description}</p>
            {data.problems_count > 0 ?
                <Fragment>
                    <p>Problems:</p>
                    <ul>
                        {data.problems.map(pb => (
                            <li key={"problem-"+pb.pk}><a href={pb.absolute_url}>{pb.name}</a></li>
                        ))}
                    </ul>
                </Fragment>
                : ''
            }
        </div>
    )
}