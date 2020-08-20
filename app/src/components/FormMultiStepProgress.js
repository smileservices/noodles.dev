import React, {useState, useEffect} from "react"

export default function FormMultiStepProgress({steps, currentStep, setStep, containerClass = "progress"}) {

    function getClassName(idx) {
        if (idx === currentStep) return 'active';
        if (idx < currentStep) return 'completed'
        return '';
    }

    return (
        <ul className={containerClass}>
            {steps.map((step, idx) => (
                <li key={"form-step-"+idx} className={ getClassName(idx) } onClick={e => setStep(idx)}>{step}</li>
            ))}
        </ul>
    )
}