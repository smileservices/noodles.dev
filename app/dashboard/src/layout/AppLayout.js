import React, {useState} from "react";
import {makeId} from "../../../src/components/utils";
import SideBarLayout from "./SideBarLayout";
import TopBarLayout from "./TopBarLayout";
import ContentLayout from "./ContentLayout";

export default function AppLayout(props) {
    return (
        <div key={makeId(8)}>
            <header id="header">
                <TopBarLayout />
            </header>
            <div id="base">
                <ContentLayout content={props.content}/>
                <SideBarLayout links={SIDEBAR_LINKS} />
            </div>
        </div>
    )
}