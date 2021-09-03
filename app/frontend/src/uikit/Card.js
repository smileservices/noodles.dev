import React from 'react';

const Card = props => {
    const {
        title,
        subtitle,
        description,
        actions,
    } = props;
    return (
        <div className="card">
            <div className="card-content">
                <div className="card-header">
                    <h4 className="header-text">{title}</h4>
                    {subtitle && 
                        <p className="subheader-text">
                            {subtitle}
                        </p>
                    }
                </div>
                <div className="card-description">
                    <p>{description}</p>
                </div>
            </div>
            
            <div className="card-footer">
                {actions}
            </div>
        </div>
    );
}

export default Card;