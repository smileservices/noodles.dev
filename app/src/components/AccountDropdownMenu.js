import React, {useState} from "react";
import ReactDOM from "react-dom";
import {makeId} from "./utils";
import onClickOutside from "react-onclickoutside";

function AccountDropdownMenu(props) {

    return (
        <li className="dropdown">
            <a className="dropdown-toggle ink-reaction" data-toggle="dropdown">
                <i className="fa fa-user" aria-hidden="true"> </i> {gettext('Account')}
            </a>
            <ul className="dropdown-menu animation-dock">
                <li className="dropdown-header">{gettext('Account')}</li>
                <li><a href={ROUTES.account.settings}>{gettext('Settings')}</a></li>
                <li><a href="#" onClick={() => props.logout()}><i
                    className="fa fa-fw fa-power-off text-danger"> </i> {gettext('Logout')}</a></li>
            </ul>
        </li>
    )
}


export default AccountDropdownMenu;