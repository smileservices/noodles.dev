import React, {useState} from "react";

export default function ContentLayout({content}) {
    return (
        <main role="main" className="container">
            {content}
        </main>
    )
}