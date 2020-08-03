import React, {useState, useEffect} from "react";
import ReactDOM from "react-dom";
import AppLayout from "../../../dashboard/src/layout/AppLayout";
import {detail} from "../../../src/api_interface/detail";
import {makeId} from "../../../src/components/utils";
import {Waiting} from "../../../src/components/Waiting";
import {Alert} from "../../../src/components/Alert";
import {Input} from "../../../src/components/form";
import {create} from "../../../src/api_interface/create";
import {update} from "../../../src/api_interface/update";
import {MerchantForm} from "./components/form";

function Content() {
    const [data, setData] = useState({});
    const [waiting, setWaiting] = useState('');
    const [hasError, setError] = useState('');
    const [alert, setAlert] = useState({});

    function handleError(result) {
        if (result.status !== 200) {
            setError('Could not read data: ' + result.statusText);
        }
    }

    useEffect(() => {
        detail(
            MERCHANT_DASHBOARD.api_endpoint,
            '',
            (data)=> {
                if (data.count > 0) {
                    setData(data.results[0])
                } else {
                    setAlert({
                        text: 'Create new profile',
                        type: 'info'
                    })
                }
            },
            setWaiting,
            handleError,
        )
    }, []);

    const createProfile = (formData) => {
        create(
            MERCHANT_DASHBOARD.api_endpoint,
            formData,
            (data) => {
                setData(data);
                setAlert({text: 'Profile created successfully', type: 'success'});
            },
            setWaiting,
            (result) => setAlert({text: 'Could not create: ' + result, type: 'danger'})
        )
    }

    const updateProfile = (formData) => {
        update(
            MERCHANT_DASHBOARD.api_endpoint,
            formData,
            formData.id,
            (data) => {
                setData(data);
                setAlert({text: 'Profile updated successfully', type: 'success'});
            },
            setWaiting,
            (result) => setAlert({text: 'Could not update: ' + result, type: 'danger'})
        )
    }


    const DisplayContent = ({data}) => {
        const HasWaiting = (
            <div className="card-body">
                <Waiting text={waiting}/>
            </div>
        )
        const HasError = (
            <div className="card-body">
                <Alert text={hasError} type="danger"/>
            </div>
        )
        if (waiting) return HasWaiting;
        if (hasError) return HasError;
        return <MerchantForm merchantProfile={data}
                             createProfile={createProfile}
                             updateProfile={updateProfile}
        />;
    }

    return (
        <section>
            <div className="section-body contain-lg">
                {alert ? <Alert text={alert.text} type={alert.type}/> : ""}
                <div className="card">
                    <div className="card-body">
                        <DisplayContent data={data}/>
                    </div>
                </div>
            </div>
        </section>
    )
}

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<AppLayout content={Content}/>, wrapper) : null;