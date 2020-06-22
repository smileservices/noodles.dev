import React, {useState} from "react";
import ReactDOM from "react-dom";
import {makeId} from "../utils";
import onClickOutside from "react-onclickoutside";

function AccountDropdownMenu(props) {
    const [expanded, setExpanded] = useState(false);
    const [logoutForm, setLogoutForm] = useState(false);
    AccountDropdownMenu.handleClickOutside = () => {
        setExpanded(false);
        setLogoutForm(false);
    }

    return (
        <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" onClick={event => {
                setExpanded(!expanded);
                setLogoutForm(false);
            }}>
                {gettext('Account')}
            </a>
            <div className={expanded ? "dropdown-menu dropdown-menu-account show" : "dropdown-menu"}>
                <a className="dropdown-item" href={ROUTES.account.settings}>{gettext('Settings')}</a>
                <a className="dropdown-item" href="#" onClick={() => props.logout()}>{gettext('Logout')}</a>
            </div>
        </li>
    )
}

const clickOutsideConfig = {
    handleClickOutside: () => AccountDropdownMenu.handleClickOutside
};

export default onClickOutside(AccountDropdownMenu, clickOutsideConfig);