import React, {useState} from "react";
import {makeId} from "./utils";
import TopBar from "./shared/TopBar";
import SideBar from "./shared/SideBar";
import ContentLayout from "./ContentLayout";

export default function (props) {
    const [sidebarCollapsed, sidebarCollapse] = useState(false);
    const sidebarToggle = e => {
        sidebarCollapse(!sidebarCollapsed);
    }

    return (
        <div key={makeId(8)}>
            <TopBar sidebarToggle={sidebarToggle} sidebarCollapsed={sidebarCollapsed}/>
            <div className="container-fluid">
                <div className="row">
                    <SideBar collapsed={sidebarCollapsed}/>
                    <ContentLayout sidebarCollapsed={sidebarCollapsed} content={props.content}/>
                </div>
            </div>
        </div>
    )
}