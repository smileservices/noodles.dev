import React from "react";
import {makeId} from "../../../src/components/utils";
import {logout} from "../../../src/components/account";
import SelectLanguageDropdown from "../../../src/components/SelectLanguageDropdown";
import AccountDropdownMenu from "../../../src/components/AccountDropdownMenu";

export default function TopBarLayout(props) {

    return (
        <div className="headerbar">
            <div className="headerbar-left">
                <ul className="header-nav header-nav-options">
                    <li className="header-nav-brand">
                        <div className="brand-holder">
                            <a className="navbar-brand" href={ROUTES.homepage}><img src="/static/imgs/rocket.svg" alt=""/></a>
                        </div>
                    </li>
                    <li>
                        <a className="btn btn-icon-toggle menubar-toggle" data-toggle="menubar">
                            <i className="fa fa-bars"> </i>
                        </a>
                    </li>
                </ul>
            </div>
            <div className="headerbar-right">
                <ul className="header-nav header-nav-options">
                    <SelectLanguageDropdown key={makeId(7)}/>
                </ul>
                <ul className="header-nav header-nav-profile">
                    <AccountDropdownMenu key={makeId(7)} logout={logout}/>
                </ul>
            </div>
        </div>
    )
}