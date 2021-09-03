import React from 'react';

const Button = props => {
    const { variant = 'filled', color = 'default', content, children, ...rest } = props;

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