import React, {useState, Fragment} from "react";
import FormatDate from "../../src/vanilla/date";
import CollectionItemsModal from "./CollectionItemsModal";
import Alert from "../../src/components/Alert";

export default function CollectionListing({data, extraData}) {

    return (
        <div className="result card">
            {extraData.toolbar}
            <div className="selectable" onClick={e => {
                if (!data.items_count) {
                    extraData.setAlert(<Alert stick={false} hideable={false} type='warning'
                                              text='The selected collection is empty'
                                              close={e=>extraData.setAlert('')}
                    />)
                    return false;
                }
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
                    <p>has {data.items_count} items</p>
                </div>
                <span className="tags">
                <span>Tags: </span>
                    {data.tags.map(t => <a key={'tag' + t.value} className="tag">{t.label}</a>)}
                    <span>Tech: </span>
                    {data.technologies.map(t => <a key={'tech' + t.value} className="tech">{t.name}</a>)}
                </span>
                <div className="thumbs">
                    { data.is_public ?
                        <Fragment>
                            <div>is public</div>
                            <div className="down"><span className="icon-thumbs-o-down"> </span><span>{data.thumbs_down}</span></div>
                            <div className="up"><span className="icon-thumbs-o-up"> </span><span>{data.thumbs_up}</span></div>
                        </Fragment>
                        : <div>not public</div>
                    }
                </div>
            </div>
        </div>
    )
}