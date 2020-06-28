import React, {useState} from "react";
import {makeId} from "../../../src/shared/utils";
import {logout} from "../../../src/shared/account";
import SelectLanguageDropdown from "../../../src/shared/SelectLanguageDropdown";
import AccountDropdownMenu from "../../../src/shared/AccountDropdownMenu";

export default function TopBarLayout(props) {

    return (
        <nav className="navbar navbar-expand-md navbar-light bg-light">
            <a className="navbar-brand" href={ROUTES.homepage}><img src="/static/imgs/rocket.svg" alt=""/></a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse"
                    aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"> </span>
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapse">
                <a className="btn btn-outline-primary btn-sm" onClick={e=>props.sidebarToggle(e)}>{props.sidebarCollapsed ? 'show' : 'hide' } sidebar</a>
                <ul className="navbar-nav ml-auto">
                    <SelectLanguageDropdown key={makeId(7)}/>
                    <AccountDropdownMenu key={makeId(7)} logout={logout}/>
                </ul>
            </div>
        </nav>
    )
}