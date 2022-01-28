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

function NotificationsApp() {
    const [modal, setModal] = useState({open: false});
    const [state, setState] = useState({
        unseen: 0,
        data: {},
        waiting: false,
        error: false,
        pagination: {
            resultsPerPage: 10,
            current: 1,
            offset: 0
        }
    })

    useEffect(e => {
        apiList(
            NOTIFICATIONS_URL,
            state.pagination,
            data => setState({...state, data: data}),
            waiting => setState({...state, waiting: waiting}),
            error => setState({...state, error: error})
        )
    }, [state.pagination])

    useEffect(e => {
        if (state.data.results?.length) {
            let unseen_count = 0;
            state.data.results.map(n => n.seen ? '' : unseen_count++)
            if (unseen_count) {
                setState({...state, unseen: unseen_count})
            }
        }
    }, [state.data])

    // hit get notifications backend every 5 seconds refresh notifications
    // if has unseen notifications, apply class "unseen" to the icon

    useEffect(e => {
        // mark as seen when open modal
        if (modal.open && state.unseen) {
            apiPost(
                NOTIFICATIONS_MARK_SEEN_URL,
                {},
                waiting => setState({...state, waiting: waiting})
            ).then(result => {
                if (result.ok) setState({...state, unseen: 0});
            });
        }
    }, [modal.open]);

    function deleteAll(e) {
        e.preventDefault();
        apiPost(
            NOTIFICATIONS_DELETE_URL,
            {},
            waiting => setState({...state, waiting: waiting})
        ).then(result => {
            if (result.ok) setState({...state, data: {count: 0, results: []}, unseen: 0});
        });
    }

    return (
        <Fragment>
            <span className="dropdown-button" onClick={e => setModal({...modal, open: true})} key={makeId(6)}>
                <span className={"button icon-info-circle" + (state.unseen ? ' active' : '')}/>
                {state.unseen ? <span className="unseen">{state.unseen}</span> : ''}
            </span>
            {modal.open
                ? <Modal close={e => setModal({...modal, open: false})}>
                    <header>
                        <h3>Notifications</h3>
                        <div className="sub">Displaying latest notifications first</div>
                    </header>
                    {state.waiting ? <Waiting text="Retrieving Notifications..."/> : ''}
                    {state.error ? <Alert text={state.error}/> : ''}
                    {state.data.count === 0 ? <h4>No Notification Yet</h4> :
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
                    }
                    <div className="buttons-container">
                        <button className="btn btn-default" onClick={deleteAll}>Delete All</button>
                    </div>
                </Modal>
                : ''}
        </Fragment>
    )
}

const notificationsElement = document.getElementById('notifications-app');
if (notificationsElement) ReactDOM.render(<NotificationsApp/>, notificationsElement);