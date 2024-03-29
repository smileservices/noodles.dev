import React from 'react';
import { shortenText } from '../utils/strings';

const Card = ({
    title,
    subtitle,
    description,
    image,
    subDescription,
    actions,
    link,
    isDetailedDescription = false,
}) => {
    const renderResponsiveText = () => {
        if (innerWidth < 960 && innerWidth >= 600) {
            return shortenText(subDescription, 0, 20);
        }

        return shortenText(subDescription, 0, 60);
    }

    const renderPlainDescription = () => {
        return (
            <div className="card-description">
                <p>{shortenText(description, 0, 150)}...</p>
            </div>
        )
    }

    const renderDetailedDescription = () => {
        const detailedDescription = (
            <div className="detailed-description">
                <h3>{shortenText(description, 0, 75)}</h3>
                <p>
                    {renderResponsiveText()}...
                    <a href={link}>View more</a>
                </p>
            </div>
        );
        if (image) {
            return (
                <div className="detailed-description-with-image">
                    <img src={image} alt={description} />
                    {detailedDescription}
                </div>
            )
        }

        return detailedDescription;
    }

    const renderDescription = isDetailedDescription ? renderDetailedDescription() : renderPlainDescription();

    return (
        <div className="card">
            <div className="card-content">
                <div className="card-header">
                    <h4 className="header-text"><a href={link}>{title}</a></h4>
                    {subtitle &&
                        <p className="subheader-text">
                            {subtitle}
                        </p>
                    }
                </div>
                {description ? renderDescription : '' }
            </div>
            {actions &&
                <div className="card-footer">
                    {actions}
                </div>
            }
        </div>
    );
}

export default Card;