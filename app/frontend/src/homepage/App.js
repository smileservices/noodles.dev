import React, {useState} from "react";
import ReactDOM from "react-dom";
import HomepageLayout from "../layout/HomepageLayout";

function Content() {
    return (
        <div className="row">
            <div className="col-md-4">
                <h2>Heading</h2>
                <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor
                    mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada
                    magna mollis euismod. Donec sed odio dui. </p>
                <p><a className="btn btn-secondary" href="#" role="button">View details »</a></p>
            </div>
            <div className="col-md-4">
                <h2>Heading</h2>
                <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor
                    mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada
                    magna mollis euismod. Donec sed odio dui. </p>
                <p><a className="btn btn-secondary" href="#" role="button">View details »</a></p>
            </div>
            <div className="col-md-4">
                <h2>Heading</h2>
                <p>Donec sed odio dui. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Vestibulum id
                    ligula porta felis euismod semper. Fusce dapibus, tellus ac cursus commodo, tortor mauris
                    condimentum nibh, ut fermentum massa justo sit amet risus.</p>
                <p><a className="btn btn-secondary" href="#" role="button">View details »</a></p>
            </div>
        </div>
    )
}


const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<HomepageLayout content={<Content />}/>, wrapper) : null;