import React from 'react';

const Button = props => {
    const { variant = 'filled', content } = props;

    return (
        <button className="uikit-button filled">
            {content}
        </button>
    );
};

export default Button;