import React, {useState, Fragment} from "react";
import apiDelete from "../../../src/api_interface/apiDelete";
import Alert from "../../../src/components/Alert";
import FormatDate from "../../../src/vanilla/date";

export default function Collection({data, handleSelect, setEdit, handleDelete}) {

    const [waiting, setWaiting] = useState('');
    const [alert, setAlert] = useState('');
    const [confirm, setConfirm] = useState(false);

    function remove() {
        apiDelete(
            COLLECTIONS_API + data.pk + '/',
            setWaiting,
            text => {
                handleDelete();
            },
            data => setAlert(<Alert close={e=>setAlert(null)} text='An error occured' type='danger'/>)
        )
    }

    function toolbarElement(confirm) {
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
                <span className="icon-pencil edit" onClick={e => {
                    e.stopPropagation();
                    setEdit();
                }}/>
                <span className="delete icon-close" onClick={e => setConfirm(true)}/>
            </Fragment>
        )
    }

    if (waiting) return waiting;

    return (
        <div className="result card selectable" onClick={e => {
            handleSelect();
        }}>
            {alert}
            <div className="toolbar" onClick={e=>e.stopPropagation()}>{toolbarElement(confirm)}</div>

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
                {data.tags.map(t => <a key={'tag' + t.pk} className="tag">{t.name}</a>)}
                <span>Tech: </span>
                {data.technologies.map(t => <a key={'tech' + t.pk} className="tech">{t.name}</a>)}
            </span>
        </div>
    )
}