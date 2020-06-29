import React, {useState} from "react";
import {makeId} from "../../../src/shared/utils";
import SideBarLayout from "./SideBarLayout";
import TopBarLayout from "./TopBarLayout";
import ContentLayout from "./ContentLayout";

export default function AppLayout(props) {
    const [sidebarCollapsed, sidebarCollapse] = useState(false);
    const sidebarToggle = e => {
        sidebarCollapse(!sidebarCollapsed);
    }

    return (
        <div key={makeId(8)}>
            <TopBarLayout sidebarToggle={sidebarToggle} sidebarCollapsed={sidebarCollapsed}/>
            <div className="container-fluid">
                <div className="row">
                    <SideBarLayout collapsed={sidebarCollapsed} links={SIDEBAR_LINKS}/>
                    <ContentLayout sidebarCollapsed={sidebarCollapsed} content={props.content}/>
                </div>
            </div>
        </div>
    )
}