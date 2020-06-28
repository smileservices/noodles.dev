import React, {useState} from "react";
import {makeId} from "../../../src/shared/utils";

function SideBarLink({url, text}) {
    return (
        <li className="nav-item">
            <a className="nav-link active" href={url}>{gettext(text)}</a>
        </li>
    );
}

export default function SideBarLayout({collapsed, links}) {
    return (
        <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
            <div className={collapsed ? "sidebar-sticky pt-3 d-none" : "sidebar-sticky pt-3"}>
                <ul className="nav flex-column">
                    {links.map(link => <SideBarLink url={link.url} text={link.text} key={makeId(5)}/>)}
                </ul>
            </div>
        </nav>
    )
}