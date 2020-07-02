import React, {useState} from 'react';
import {ConfirmComponent} from "../../../../src/components/form";

export const PeopleListing = ({person, editAction, deleteAction}) => {
    return (
        <tr>
            <td>{person.id}</td>
            <td>{person.name}</td>
            <td>{person.age}</td>
            <td>{person.nationality}</td>
            <td>
                <a className="btn btn-link" onClick={e => {
                    e.preventDefault();
                    editAction(person);
                }}>edit</a>
            </td>
            <td>
                <ConfirmComponent
                    buttonText="delete"
                    questionText="Are you sure you want to delete?"
                    handleConfirm={()=>deleteAction(person)}
                />
            </td>
        </tr>
    )
}