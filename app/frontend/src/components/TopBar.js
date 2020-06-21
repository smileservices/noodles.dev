import React, {useState} from "react";
import ReactDOM from "react-dom";
import {makeId} from "../utils";
import AccountDropdownMenu from "../../../dashboard/src/components/AccountDropdownMenu";
import SelectLanguageDropdown from "../../../dashboard/src/components/SelectLanguageDropdown";
import {logout} from "../../../dashboard/src/account";

export default function TopBar(props) {

    return (
        <nav className="navbar navbar-expand-md navbar-dark bg-dark">
            <a className="navbar-brand" href="#">Top navbar</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse"
                    aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"> </span>
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapse">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                        <a className="nav-link" href="#">{gettext('Home')} <span className="sr-only">(current)</span></a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Link</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link disabled" href="#" tabIndex="-1" aria-disabled="true">Disabled</a>
                    </li>
                </ul>
                <ul className="navbar-nav">
                    <SelectLanguageDropdown key={makeId(7)}/>
                    {props.userData.is_authenticated
                        ? <AccountDropdownMenu key={makeId(7)} logout={logout}/>
                        : <li className="nav-item"><a className="nav-link" href={ROUTES.account.login}>{gettext('Login')}</a></li>
                    }
                </ul>
            </div>
        </nav>
    )
}