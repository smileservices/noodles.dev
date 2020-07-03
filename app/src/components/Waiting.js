import React from 'react';

export function Waiting({text}) {
    return (
        <div className="waiting-container">
            <p className="text">{text}</p>
            <i className="spinner fa fa-cog"> </i>
        </div>
    )
}