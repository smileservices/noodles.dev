import React from 'react';

export default function Waiting({text}) {
    return (
        <div className="waiting-container">
            <span className="icon-hour-glass spin-stop"> </span>
            <span className="text">{text}</span>
        </div>
    )
}

export function WaitingInline({text}) {
    return (
        <div className="waiting-inline-container">
            <span className="icon-hour-glass spin-stop"> </span>
            <span className="text">{text}</span>
        </div>
    )
}

export function WaitingButton({text}) {
    return (
        <button className="btn submit waiting" type="submit" disabled={true}>
            <span className="icon-hour-glass spin-stop"> </span>
            <span className="text">{text}</span>
        </button>
    )
}