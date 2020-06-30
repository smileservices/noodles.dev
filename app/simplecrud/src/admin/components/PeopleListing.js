import React from 'react';

export const PeopleListing = ({person}) => (
    <ul className="list-group list-group-horizontal">
        <li className="list-group-item">Name: {person.name}</li>
        <li className="list-group-item">Age: {person.age}</li>
        <li className="list-group-item">Nationality: {person.nationality}</li>
    </ul>
)