import React from "react";

export default function UserListing({data}) {
    return (
        <span className="user-listing">
            <span className="username"><a href={"/users/profile/" + data.username}>{data.username}</a></span>
        </span>
    )
}