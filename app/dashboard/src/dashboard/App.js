import React, {useState} from "react";
import ReactDOM from "react-dom";
import AppLayout from "../layout/AppLayout";

function Content() {
    return (
        <section>
        <div className="section-body contain-lg">
            <div className="col-md-8">
                <div className="card card-bordered style-primary">
                    <div className="card-head">
                        <header>Welcome to the dashboard</header>
                        <div className="tools">
                            <a className="btn btn-icon-toggle btn-close"><i className="md md-close"> </i></a>
                        </div>
                    </div>
                    <div className="card-body">
                        The main dashboard view
                    </div>
                </div>
            </div>
        </div>
        </section>
    )
}

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<AppLayout content={Content} />, wrapper) : null;