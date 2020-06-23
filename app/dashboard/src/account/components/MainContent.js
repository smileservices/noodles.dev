import React, {useState} from "react";
import {makeId} from "../../utils";

export default function MainContent(attrs) {
    return (
        <div className="card">
            <div className="card-header">
            <h1 className="h2">{gettext('Account Settings')}</h1>
                </div>
            <div className="card-body">
            <p><a className="btn btn-outline-primary" href={ROUTES.account.account_email}>change email </a></p>
            <p><a className="btn btn-outline-primary" href={ROUTES.account.change_password}>change password</a></p>
            <p><a className="btn btn-outline-primary" href={ROUTES.account.socialaccount_connections}>change social accounts</a></p>
            </div>
        </div>
    )
}