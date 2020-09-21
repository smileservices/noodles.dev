import React, {Fragment, useState} from "react";
import Waiting from "../../../src/components/Waiting";
import apiDelete from "../../../src/api_interface/apiDelete";
import Alert from "../../../src/components/Alert";
import FormatDate from "../../../src/vanilla/date";
import AddToCollectionModal from "../collections/AddToCollectionModal";
import ResourceRating from "../ResourceRating";

export default function DetailStatic({data, tags, techs, options, setEditForm}) {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [showAddToCollectionModal, setShowAddToCollectionModal] = useState(false);
    const [waiting, setWaiting] = useState(false);
    const [alert, setAlert] = useState(false);

    function deleteResource() {
        apiDelete(
            STUDY_RESOURCE_ENDPOINT + RESOURCE_ID,
            setWaiting,
            data => {
                setAlert(<Alert close={e=>setAlert(null)} text={"Successfully deleted. Returning to homepage..."} type="info" hideable={false} stick={false}/>)
                window.location = HOMEPAGE
            },
            result => setAlert(<Alert close={e=>setAlert(null)} text={"Could not delete study resource"} type="danger" hideable={false}/>)
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
                            <span className="icon-bookmark" onClick={e=>setShowAddToCollectionModal(true)}/>
                        </Fragment>
                    }
            </span>
            <p className="rating">
                <ResourceRating rating={RESULT.rating} maxRating={MAX_RATING} reviewsCount={RESULT.reviews_count} />
            </p>
            <h1 className="title" itemProp="name">{data.name}</h1>
            <img className="primary-image" src={ data.image_file } alt=""/>
            <div className="group">
                <p className="publication-date">Published
                    on {FormatDate(data.publication_date, 'date')} by {data.published_by}</p>
                <p className="creation-date">Added here on {FormatDate(data.created_at, 'date')} by {data.author}</p>
                {!options ? <Waiting text={"Loading options"}/>
                    : <Fragment>
                        <p className="experience-level">Experience level:
                            <span itemProp="educationalLevel"> {options.experience_level.map(opt => {
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
                <p className="source_url"><a href={data.url}>resource url</a></p>
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
            {showAddToCollectionModal ? <AddToCollectionModal close={e=>setShowAddToCollectionModal(false)}/> : ''}
        </Fragment>
    );
}