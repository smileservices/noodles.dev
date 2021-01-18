import React, {useState, Fragment} from "react";
import FormatDate from "../../../src/vanilla/date";
import CollectionItemsModal from "./CollectionItemsModal";

export default function CollectionListing({data, extraData}) {

    return (
        <div className="result card">
            {extraData.toolbar}
            <div className="selectable" onClick={e => {
                extraData.setModal(
                    <CollectionItemsModal collection={data}
                                          setMainAlert={extraData.setAlert}
                                          close={e => extraData.setModal(false)}/>
                );
            }}>
                <p className="title">{data.name}</p>
                <div className="group-muted">
                    <div className="row">
                        <span className="date">Created on {FormatDate(data.created_at, 'date')}</span>
                        {/*<span className="items">{data.items_count} items</span>*/}
                    </div>
                    <p className="summary">{data.description}</p>
                </div>
                <span className="tags">
                <span>Tags: </span>
                    {data.tags.map(t => <a key={'tag' + t.value} className="tag">{t.label}</a>)}
                    <span>Tech: </span>
                    {data.technologies.map(t => <a key={'tech' + t.pk} className="tech">{t.name}</a>)}
                </span>
            </div>
        </div>
    )
}