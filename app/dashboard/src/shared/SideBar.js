import React, {useState} from "react";
import ReactDOM from "react-dom";
import {makeId} from "../utils";

export default function SideBar(props) {
    return (
        <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
            <div className={ props.collapsed ? "sidebar-sticky pt-3 d-none" : "sidebar-sticky pt-3" } >
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <a className="nav-link active" href="#">
                            Dashboard <span className="sr-only">(current)</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">
                            Orders
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">
                            Products
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">
                            Customers
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">
                            Reports
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">
                            Integrations
                        </a>
                    </li>
                </ul>

                <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                    <span>Saved reports</span>
                    <a className="d-flex align-items-center text-muted" href="#" aria-label="Add a new report">
                    </a>
                </h6>
                <ul className="nav flex-column mb-2">
                    <li className="nav-item">
                        <a className="nav-link" href="#">
                            Current month
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">
                            Last quarter
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">
                            Social engagement
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">
                            Year-end sale
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    )
}