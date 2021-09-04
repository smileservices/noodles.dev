import React from 'react';

const Button = ({
    variant = 'filled',
    color = 'default',
    content,
    children,
    ...rest
}) => {
    return (
        <button
            {...rest}
            className={`uikit-button ${variant} ${color}`}
        >
            {content || children}
        </button>
    );
};

export default Button;