import React, {Fragment, useState} from "react";
import StarRating from "../../../src/components/StarRating";
import Waiting from "../../../src/components/Waiting";
import apiDelete from "../../../src/api_interface/apiDelete";
import Alert from "../../../src/components/Alert";
import FormatDate from "../../../src/vanilla/date";
import {openAddCollectionModal} from "../collections/AddToCollectionModal";

export default function DetailStatic({data, tags, techs, options, setEditForm}) {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [waiting, setWaiting] = useState(false);
    const [alert, setAlert] = useState(false);

    function deleteResource() {
        apiDelete(
            STUDY_RESOURCE_ENDPOINT + RESOURCE_ID,
            setWaiting,
            data => {
                setAlert(<Alert text={"Successfully deleted. Returning to homepage..."} type="info"/>)
                window.location = HOMEPAGE
            },
            result => setAlert(<Alert text={"Could not delete study resource"} type="danger"/>)
        )
    }

    if (waiting) return waiting;

    return (
        <Fragment>
            {alert ? alert : ''}
            <span className="toolbar">
                    {confirmDelete
                        ? <div className="confirm">
                            <span className="text">Are you sure?</span>
                            <span className="option delete" onClick={deleteResource}>yes</span>
                            <span className="option" onClick={e => setConfirmDelete(false)}>cancel</span>
                        </div>
                        : <Fragment>
                            {RESULT.author_id === USER_ID
                                ?
                                <Fragment>
                                    <span className="icon-pencil edit" onClick={e => setEditForm(true)}/>
                                    <span className="icon-close delete" onClick={e => setConfirmDelete(true)}/>
                                </Fragment>
                                : ''
                            }
                            <span className="icon-bookmark" onClick={e => openAddCollectionModal()}/>
                        </Fragment>
                    }
            </span>
            <p className="rating">
                <span><StarRating maxRating={5} rating={RESULT.rating}/></span>
                <span>
                    <span itemProp="ratingValue">{RESULT.rating}</span>/<span itemProp="bestRating">{MAX_RATING}</span>
                </span>
                <span>
                    (<span itemProp="ratingCount">{RESULT.reviews_count}</span> reviews)
                </span>
            </p>
            <h1 className="title" itemProp="name">
                <a href="">{data.name}</a>
            </h1>
            <div className="group">
                <p className="publication-date">Published
                    on {FormatDate(data.publication_date, 'date')} by {data.published_by}</p>
                <p className="creation-date">Added here on {FormatDate(data.created_at, 'date')} by {data.author}</p>
                {!options ? <Waiting text={"Loading options"}/>
                    : <Fragment>
                        <p className="experience-level">Experience level:
                            <span itemProp="educationalLevel">{options.experience_level.map(opt => {
                                if (opt[0] === data.experience_level) return opt[1];
                            })}</span>
                        </p>
                        <p className="type">
                            <span>
                            {options.type.map(opt => {
                                if (opt[0] === data.type) return opt[1];
                            })} </span>
                            <span itemProp="learningResourceType">{options.media.map(opt => {
                                if (opt[0] === data.media) return opt[1];
                            })}
                            </span>
                        </p>
                    </Fragment>
                }
            </div>
            <p className="summary" itemProp="abstract">{data.summary}</p>
            {!tags ? <Waiting text={"Loading tags"}/>
                : <span className="tags" itemProp="keywords">
                    <span>Tags: </span>
                    {data.tags.map(id => tags.map(tobj => {
                        if (tobj.pk === id) {
                            return (<a key={tobj.pk + 'tag'} className="tag"
                                       href={SEARCH_URL + "?tags=" + tobj.pk}>{tobj.name}</a>)
                        }
                    }))
                    }
                </span>
            }
            {!techs ? <Waiting text={"Loading technologies"}/>
                : <span className="tags" itemProp="keywords">
                    <span>Tech: </span>
                    {data.technologies.map(id => techs.map(tobj => {
                        if (tobj.pk === id) {
                            return (<a key={tobj.pk + 'tech'} className="tech"
                                       href={SEARCH_URL + "?technologies=" + tobj.pk}>{tobj.name + ' ' + tobj.version}</a>)
                        }
                    }))
                    }
                </span>
            }
        </Fragment>
    );
}