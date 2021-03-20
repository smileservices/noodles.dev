import React, {useState, Fragment} from "react";
import FormatDate from "../../src/vanilla/date";
import CollectionItemsModal from "./CollectionItemsModal";
import Alert from "../../src/components/Alert";
import TruncatedTextComponent from "../../src/components/TruncatedTextComponent";

const flagIcon = (
    <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M9.50198 4.5L11.002 1H2.00198V0.5C2.00198 0.224 1.77798 0 1.50198 0C1.22598 0 1.00198 0.224 1.00198 0.5V11.5C1.00198 11.776 1.22598 12 1.50198 12C1.77798 12 2.00198 11.776 2.00198 11.5V8H11.002L9.50198 4.5Z"
            fill="black"/>
    </svg>);

export default function CollectionListing({data, extraData}) {

    return (
        <div className="selectable" onClick={e => {
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
            <div className="result card">
                {extraData.toolbar}

                <div className="tags">
                    {data.technologies.map(t =>
                        <a key={t.value} href={'/technologies/' + t.value + '/' + t.label}
                           className="tech"><span>{flagIcon} {t.label}</span></a>)
                    }
                </div>
                <div className="listing-title">
                    <h4 className="title" itemProp="name">
                        <a itemProp="name" href={data.url}>{data.name}</a>
                    </h4>
                    <span className="published">{data.created_at} By {data.author.username}</span>
                    <span className="published">{data.items_count} Resources</span>
                </div>

                <p className="description">
                    <TruncatedTextComponent fullText={data.description} charLimit={250}/>
                </p>
                <span className="tags">{data.tags.map(t => <span key={t.value}
                                                                 className="tag"># {t.label}</span>)}</span>
                <div className="thumbs">
                    {data.is_public ?
                        <Fragment>
                            <div>is public</div>
                            <div className="down"><span
                                className="icon-thumbs-o-down"> </span><span>{data.thumbs_down}</span></div>
                            <div className="up"><span className="icon-thumbs-o-up"> </span><span>{data.thumbs_up}</span>
                            </div>
                        </Fragment>
                        : <div>not public</div>
                    }
                </div>
            </div>
        </div>
    )
}