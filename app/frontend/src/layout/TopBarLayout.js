import React, {useState} from "react";
import {makeId} from "../../../src/shared/utils";
import AccountDropdownMenu from "../../../src/shared/AccountDropdownMenu";
import SelectLanguageDropdown from "../../../src/shared/SelectLanguageDropdown";
import {logout} from "../../../src/shared/account";

export default function TopBarLayout(props) {

    return (
        <nav className="navbar navbar-expand-md navbar-dark bg-dark">
            <a className="navbar-brand" href={ROUTES.homepage}>{gettext('Home')}</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse"
                    aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"> </span>
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapse">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <a className="nav-link" href={ROUTES.dashboard}>{gettext('Dashboard')}</a>
                    </li>
                </ul>
                <ul className="navbar-nav">
                    <SelectLanguageDropdown key={makeId(7)}/>
                    {props.userData.is_authenticated
                        ? <AccountDropdownMenu key={makeId(7)} logout={logout}/>
                        : <li className="nav-item"><a className="nav-link" href={ROUTES.account.login}><i className="fas fa-sign-in-alt"></i></a></li>
                    }
                </ul>
            </div>
        </nav>
    )
}