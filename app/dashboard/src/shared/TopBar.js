import React, {useState} from "react";
import ReactDOM from "react-dom";
import {makeId} from "../utils";
import {logout} from "../account";
import AccountDropdownMenu from "./AccountDropdownMenu";
import SelectLanguageDropdown from "./SelectLanguageDropdown";

export default function TopBar(props) {

    return (
        <nav className="navbar navbar-expand-md navbar-dark bg-dark mb-4">
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
                    <AccountDropdownMenu key={makeId(7)} logout={logout}/>
                </ul>
            </div>
        </nav>
    )
}