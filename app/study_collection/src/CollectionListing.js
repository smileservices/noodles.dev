import React, {useState, Fragment} from "react";
import FormatDate from "../../src/vanilla/date";
import CollectionItemsModal from "./CollectionItemsModal";
import Alert from "../../src/components/Alert";
import {shortenText} from "../../frontend/src/utils/strings";
import {makeId} from "../../src/components/utils";

const flagIcon = (
    <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M9.50198 4.5L11.002 1H2.00198V0.5C2.00198 0.224 1.77798 0 1.50198 0C1.22598 0 1.00198 0.224 1.00198 0.5V11.5C1.00198 11.776 1.22598 12 1.50198 12C1.77798 12 2.00198 11.776 2.00198 11.5V8H11.002L9.50198 4.5Z"
            fill="black"/>
    </svg>);

export default function CollectionListing({data, extraData}) {

    return (
        <div className="card selectable result collection" onClick={e => {
            if (!data.items_count) {
                extraData.setAlert(<Alert stick={false} hideable={false} type='warning'
                                          text='The selected collection is empty'
                                          close={e => extraData.setAlert('')}
                />)
                return false;
            }
            extraData.setModal(
                <CollectionItemsModal collection={data}
                                      setMainAlert={extraData.setAlert}
                                      close={e => extraData.setModal(false)}/>
            );
        }}>
            {extraData.toolbar}
            <div className="listing-title">
                <div className="tags">
                    {data.technologies.map(t => <a key={makeId()} className="tech">{flagIcon} {t.label}</a>)}
                </div>
                <h4 className="title"><a href={data.url}>{data.name}</a></h4>
                <span className="published">Created by {data.author.username}</span>
            </div>

            <p className="description">
                {shortenText(data.description, 0, 160)}...
            </p>

            <span className="tags">
                {data.tags.map(t => <span key={makeId()} className="tag"># {t.label}</span>)}
            </span>
            <div className="footer">
                <div>{data.items_count} Resources</div>
                <div className="thumbs">
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