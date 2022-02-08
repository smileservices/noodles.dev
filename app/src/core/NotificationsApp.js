import React, {useState, useEffect, Fragment} from "react";
import ReactDOM from "react-dom";
import apiList from "../api_interface/apiList";
import apiPost from "../api_interface/apiPost";
import Modal from "../../src/components/Modal";
import {makeId} from "../components/utils";
import PaginatedLayout from "../components/PaginatedLayout";
import Waiting from "../components/Waiting";
import Alert from "../components/Alert";
import FormatDate from "../vanilla/date";


function NotificationsModalComponent({close}) {
    const [state, setState] = useState({
        data: [],
        waiting: false,
        error: false,
        pagination: {
            resultsPerPage: 10,
            current: 1,
            offset: 0
        }
    });

    function markAllSeen() {
        apiPost(
            URLS.notifications.mark_seen,
            {},
            waiting => {}
        )
    }

    useEffect(e => {
        apiList(
            URLS.notifications.get,
            state.pagination,
            data => setState({...state, data: data}),
            waiting => setState({...state, waiting: waiting}),
            error => setState({...state, error: error})
        )
    }, [state.pagination])

    function deleteAll(e) {
        e.preventDefault();
        apiPost(
            URLS.notifications.delete,
            {},
            waiting => setState({...state, waiting: waiting})
        ).then(result=>{
            if (result.ok) {
                setState({...state, data: []})
            }
        })
    }

    return (
        <Modal close={()=> {markAllSeen(); close();}}>
            <header>
                <h3>Notifications</h3>
                <div className="sub">Displaying latest notifications first</div>
            </header>
            {state.waiting ? <Waiting text="Retrieving Notifications..."/> : ''}
            {state.error ? <Alert text={state.error}/> : ''}
            {state.data.length === 0 ? 'No notifications' : ''}
            <PaginatedLayout data={state.data.results} resultsCount={state.data.count}
                             pagination={state.pagination}
                             setPagination={pagination => setState({...state, pagination: pagination})}
                             resultsContainerClass="notifications column-container vmargin-big"
                             mapFunction={(item, idx) =>
                                 <div key={makeId(5)} className={"item" + (item.seen ? '' : ' unseen')}>
                                     <span className="date">{FormatDate(item.datetime, 'datetime')}</span>
                                     <span className="message"
                                           dangerouslySetInnerHTML={{__html: item.message}}/>
                                 </div>
                             }
            />
            <div className="buttons-container">
                <button className="btn btn-default" onClick={deleteAll}>Delete All</button>
            </div>
        </Modal>
    )
}

function NotificationsListItemComponent({data, openModal}) {
    return (
        <Fragment>
            <a href="#" className="notifications menu-item"
               onClick={data.total ? openModal : ()=>{}}
               key={makeId(6)}>
                {data.total ? data.total : 'No'} notifications
                {data.unseen ? <span className="unseen">{data.unseen} unseen</span> : ''}
            </a>
        </Fragment>
    )
}


export default function NotificationsComponent({notificationCallback}) {
    const [state, setState] = useState({
        unseen: 0,
        data: {},
        waiting: false,
        error: false,
    })
    const [modal, setModal] = useState(false);

    useEffect(e => {
        // hit the notifications report endpoint
        fetch(URLS.notifications.summary).then(response => {
            if (response.ok) {
                return response.json()
            }
        }).then(data => {
            setState({...state, data: data, unseen: data.unseen});
            // success -> execute notificationCallback which returns the NotificationsListItemComponent
            notificationCallback(
                <NotificationsListItemComponent
                    data={data}
                    openModal={()=>setModal(true)}
                />);
        })
    }, [modal])

    // hit get notifications backend every 5 seconds refresh notifications
    // if has unseen notifications, apply class "unseen" to the icon

    return <Fragment>
        {state.unseen ? (<span className="notifications unseen">{state.unseen}</span>) : ''}
        {modal ? <NotificationsModalComponent close={e => setModal(false)}/> : ''}
    </Fragment>
}