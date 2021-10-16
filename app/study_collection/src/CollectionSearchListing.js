import React from "react";
import { shortenText } from '../../frontend/src/utils/strings';
import TruncatedTextComponent from "../../src/components/TruncatedTextComponent";

const flagIcon = (
    <svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M9.50198 4.5L11.002 1H2.00198V0.5C2.00198 0.224 1.77798 0 1.50198 0C1.22598 0 1.00198 0.224 1.00198 0.5V11.5C1.00198 11.776 1.22598 12 1.50198 12C1.77798 12 2.00198 11.776 2.00198 11.5V8H11.002L9.50198 4.5Z"
            fill="#1752EA"/>
    </svg>);

export default function CollectionSearchListing({data, addFilter}) {
    return (
        <div className="collections-card">
            <div className="tags">
                {data.technologies.map(t =>
                    <a key={data.pk + t} onClick={e => addFilter('technologies', t)}
                       className="tech"><span>{flagIcon} {t}</span></a>)
                }
            </div>

            <div className="listing-title">
                <a itemProp="name" className="name" href={data.url}>{data.name}</a>
                <span className="published">Created by {data.author.username}</span>
            </div>

            <p className="description">
                {shortenText(data.description, 0, 85)}...
            </p>

            <span className="tags">
                {data.tags.map(t => <span key={'tag' + t} onClick={e => addFilter('tags', t)}
                                          className="tag"># {t}</span>)}

            </span>

            <div className="thumbs">
                <span className="published">{data.items_count} Resources</span>
                <div className="container">
                    <div className="down">
                        <span className="icon-thumbs-o-down"> </span><span>{data.thumbs_down}</span>
                    </div>
                    <div className="up"><span className="icon-thumbs-o-up"> </span>
                        <span>{data.thumbs_up}</span>
                    </div>
                </div>
            </div>

        </div>
    )
}