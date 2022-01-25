import React, {useState, useEffect, Fragment} from "react";
import ReactDOM from "react-dom";
import apiList from "../api_interface/apiList";
import Modal from "../../src/components/Modal";
import {makeId} from "../components/utils";
import PaginatedLayout from "../components/PaginatedLayout";
import Waiting from "../components/Waiting";
import Alert from "../components/Alert";
import FormatDate from "../vanilla/date";

function NotificationsApp() {
    const [openModal, setOpenModal] = useState(false);
    const [state, setState] = useState({
        unseen: false,
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

    useEffect(e=>{
        setState({...state, unseen: state.data.results?.length })
    }, [state.data])

    // hit get notifications backend every 5 seconds refresh notifications
    // if has unseen notifications, apply class "unseen" to the icon

    return (
        <Fragment>
            <span className="dropdown-button" onClick={e=>setOpenModal(true)} key={makeId(6)}>
                <span className={"button icon-info-circle" + (state.unseen ? ' active' : '')}/>
                {state.unseen ? <span className="unseen">{state.unseen}</span> : ''}
            </span>
            {openModal
                ? <Modal close={e => setOpenModal(false)}>
                    <header><h3>Notifications</h3></header>
                    {state.waiting ? <Waiting text="Retrieving Notifications..." /> : '' }
                    {state.error ? <Alert text={state.error} /> : '' }
                    {state.data.count === 0 ? <h4>No Notification Yet</h4> :
                        <PaginatedLayout data={state.data.results} resultsCount={state.data.count}
                                         pagination={state.pagination}
                                         setPagination={pagination => setState({...state, pagination: pagination})}
                                         resultsContainerClass="notifications column-container"
                                         mapFunction={(item, idx) =>
                                             <div key={makeId(5)} className="item">
                                                 <span className="date">{FormatDate(item.dateTime, 'datetime')}</span>
                                                 <span className="message">{item.message}</span>
                                             </div>
                                         }
                        />
                    }
                </Modal>
                : ''}
        </Fragment>
    )
}

const notificationsElement = document.getElementById('notifications-app');
if (notificationsElement) ReactDOM.render(<NotificationsApp/>, notificationsElement);