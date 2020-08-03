import React, {useState} from "react";
import ReactDOM from "react-dom";
import AppLayout from "../layout/AppLayout";

function Content() {
    return (
        <section>
            <div className="section-body contain-lg">
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
            </div>
        </section>
    )
}

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<AppLayout content={Content} />, wrapper) : null;