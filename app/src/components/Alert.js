import React from 'react';

export const Alert = ({text, type}) => (
    <div className={"alert alert-"+type} role="alert">{text}</div>
)