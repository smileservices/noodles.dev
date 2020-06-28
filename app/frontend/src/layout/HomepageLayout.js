import React, {useState} from "react";
import ReactDOM from "react-dom";
import {makeId} from "../../../src/shared/utils";
import TopBarLayout from "./TopBarLayout";
import ContentLayout from "./ContentLayout";
import Header from "../homepage/Header";

const USER_DATA = {
    'is_authenticated': USER_AUTH
}

function HomepageLayout({content}) {
    return (
        <div key={makeId(8)}>
            <TopBarLayout userData={USER_DATA}/>
            <Header />
            <ContentLayout content={content} />
        </div>
    )
}

export default HomepageLayout;