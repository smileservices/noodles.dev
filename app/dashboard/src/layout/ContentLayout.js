import React, {useState} from "react";

export default function ContentLayout(props) {
    const widthClasses = props.sidebarCollapsed ? "col-md-12 col-lg-12" : "col-md-9 col-lg-10";
    return (
        <main role="main" className={"ml-sm-auto px-md-4 " + widthClasses}>
            <props.content/>
        </main>
    )
}