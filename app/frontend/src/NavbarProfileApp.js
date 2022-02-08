import React, {useState, Fragment, useEffect, useRef} from "react";
import ReactDOM from "react-dom";
import apiPost from "../../src/api_interface/apiPost";
import {WaitingInline} from "../../src/components/Waiting";
import Alert from "../../src/components/Alert";
import {handleClickOutside} from "../../src/components/utils";
import NotificationsApp from "../../src/core/NotificationsApp";

function NavbarProfileApp() {
    const [state, setState] = useState({
        authenticated: IS_AUTHENTICATED,
        waiting: false,
        error: false,
        menu_open: false,
        menu_open_add: false,
    });
    const [notifications, setNotifications] = useState(null);

    function logout(e) {
        e.preventDefault();
        apiPost(URLS.logout, {}, waiting => setState({...state, waiting: waiting})).then(response => {
            if (response.ok) {
                console.log('logout ok')
                window.sessionStorage.removeItem('user_data');
                setState({...state, menu_open: false, authenticated: false})
            } else {
                console.log('logout not ok')
                setState({...state, error: response.statusText, menu_open: false});
            }
        });
    }


    const dropdownMenuAdd = () => (
        <div className="dropdown-menu dropdown-create">
            <a rel="nofollow noopener" href={URLS.resource.create}>
                <span className="anchor-title">Add resource</span>
                <span className="anchor-description">An article, tutorial, course or a book</span>
            </a>
            <a rel="nofollow noopener" href={URLS.technology.create}>
                <span className="anchor-title">Add technology</span>
                <span className="anchor-description">Discuss about a programming language</span>
            </a>
        </div>
    )

    const dropdownProfileMenu = () => (
        <div className="dropdown-menu dropdown-menu-account">
            <div className="profile">
                <span className="dropdown-button-icon icon-person-circle"/>
                <div>
                    <a rel="nofollow noopener" href={URLS.profile}>My Profile</a>
                </div>
            </div>
            <div className="other-menu-items">
                {notifications}
                <a rel="nofollow noopener" href={URLS.subscriptions}>Subscriptions</a>
                <a rel="nofollow noopener" href={URLS.collections}>My Collections</a>
                <a rel="nofollow noopener" onClick={logout} className="signout_button">Sign Out</a>
            </div>
        </div>
    )

    if (state.error) return (<Alert text={state.error}/>);
    if (state.waiting) return (<WaitingInline text="..."/>);
    if (!state.authenticated) return (<a href={URLS.login} className="btn primary">Login</a>);

    return (
        <Fragment>
            <div className="dropdown">
                <span className="btn secondary dropdown-button"
                      onClick={e => {
                          setState({...state, menu_open: state.menu_open === 'add' ? false : 'add'});
                      }}>
                    Add
                </span>
                {state.menu_open === 'add' ? dropdownMenuAdd() : ''}
            </div>
            <div className="dropdown">
                    <span className="dropdown-button"
                          onClick={e => {
                              if (e.target.className.split(' ').indexOf('modal') > -1) return null;
                              setState({...state, menu_open: state.menu_open === 'profile' ? false : 'profile'});
                          }}>
                        <span className="dropdown-button-icon icon-person-circle"/>
                        <NotificationsApp
                            notificationCallback={notificationsMenu => setNotifications(notificationsMenu)}/>
                    </span>
                {state.menu_open === 'profile' ? dropdownProfileMenu() : ''}
            </div>
        </Fragment>
    )
}

ReactDOM.render(<NavbarProfileApp/>, document.getElementById("profile-app"));