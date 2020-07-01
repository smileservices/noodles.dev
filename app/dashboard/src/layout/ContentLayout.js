import React from "react";

export default function ContentLayout(props) {
    return (
        <div id="content">
            <props.content />
        </div>
    )
}