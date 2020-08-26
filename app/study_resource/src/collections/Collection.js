import React, {useState, Fragment} from "react";
import apiDelete from "../../../src/api_interface/apiDelete";
import Alert from "../../../src/components/Alert";
import FormatDate from "../../../src/vanilla/date";
import Waiting from "../../../src/components/Waiting";

export default function Collection({data, setEdit, handleDelete}) {

    const [waiting, setWaiting] = useState('');
    const [alert, setAlert] = useState('');
    const [confirm, setConfirm] = useState(false);

    function remove() {
        apiDelete(
            COLLECTIONS_ENDPOINT + data.pk + '/',
            setWaiting,
            text => {
                handleDelete();
            },
            data => setAlert(<Alert text='An error occured' type='danger'/>)
        )
    }

    function deleteElement(confirm) {
        if (confirm) {
            return (
                <div className="confirm">
                    <span className="text">Are you sure?</span>
                    <span className="option delete" onClick={remove}>yes</span>
                    <span className="option" onClick={e => setConfirm(false)}>cancel</span>
                </div>
            );
        }
        return (
            <Fragment>
                <span className="icon-pencil edit" onClick={e => setEdit()}/>
                <span className="delete icon-close" onClick={e => setConfirm(true)}/>
            </Fragment>
        )
    }

    if (waiting) return waiting;

    return (
        <div className="result">
            {alert}
            <div className="toolbar">{deleteElement(confirm)}</div>

            <p className="title">
                <a href="">{data.name}</a>
            </p>
            <p>
                <span className="date">Created on {FormatDate(data.created_at, 'date')}</span>
                <span className="items">{data.items_count} items</span>
            </p>
            <p className="summary">{data.description}</p>
            <span className="tags">
                <span>Tags: </span>
                {data.tags.map(t=> <a key={'tag'+t.pk} className="tag">{t.name}</a>)}
            </span>
            <span className="tags">
                <span>Tech: </span>
                {data.technologies.map(t=> <a key={'tech'+t.pk} className="tech">{t.name}</a>)}
            </span>
        </div>
    )
}