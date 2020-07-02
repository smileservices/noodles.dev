import React, {useState} from "react";
import {makeId} from "../../../src/components/utils";

function SideBarLink({url, text}) {
    return (
        <li>
            <a href={url}><span className="title">{gettext(text)}</span></a>
        </li>
    );
}

export default function SideBarLayout({links}) {
    return (
        <div id="menubar">

            <div className="menubar-fixed-panel">
                <div>
                    <a className="btn btn-icon-toggle menubar-toggle" data-toggle="menubar"
                       href="#">
                        <i className="fa fa-bars"> </i>
                    </a>
                </div>
                <div className="expanded">
                    <a className="navbar-brand" href={ROUTES.homepage}><img src="/static/imgs/rocket.svg" alt=""/></a>
                </div>
            </div>
            <div className="menubar-scroll-panel">
                <ul id="main-menu" className="gui-controls">
                    {links.map(link => <SideBarLink url={link.url} text={link.text} key={makeId(5)}/>)}
                </ul>
            </div>
        </div>
    )
}