import React, {useState} from 'react';
import {Input} from "../../../../src/components/form";

export const PersonEditForm = ({person}) => {
    const [formData, setFormData] = useState(person);
    console.log('rendered person edit form', formData);
    return (
        <form action="">
            <Input
                key="input_name"
                id="input_name"
                label="Person Name"
                smallText={"This is the person name"}
                inputProps={{
                    name: "name",
                    value: formData.name,
                    type: "text",
                    onChange: e => setFormData({...formData, name: e.target.value})
                }}
            />
            <Input
                key="input_age"
                id="input_age"
                label="Person Age"
                inputProps={{
                    name: "age",
                    value: formData.age,
                    type: "number",
                    step: 1,
                    onChange: e => setFormData({...formData, age: e.target.value})
                }}
            />
        </form>
    )
}