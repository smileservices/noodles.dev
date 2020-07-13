import React, {useState} from "react";
import {Input} from "../../../../src/components/form";

export const MerchantForm = ({merchantProfile, createProfile, updateProfile}) => {
    const emptyForm = {
        name: '',
        id: false
    };
    const [formData, setFormData] = useState(merchantProfile ? merchantProfile : emptyForm)
    function action(e, formData) {
        e.preventDefault();
        if (formData.id) {
            updateProfile(formData)
        } else {
            createProfile(formData)
        }
    }
    return (
        <div>
            <Input
                key="input_name"
                id="input_name"
                label="Name"
                smallText={"This is the merchant profile name"}
                inputProps={{
                    name: "name",
                    value: formData.name,
                    type: "text",
                    onChange: e => setFormData({...formData, name: e.target.value})
                }}
            />
            <input type="hidden" value={formData.id}/>
            <button className="btn btn-primary" type="submit" onClick={e => action(e, formData)}>submit</button>
        </div>
    )
}