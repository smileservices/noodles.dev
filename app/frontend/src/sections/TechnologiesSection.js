import React from 'react';
import Button from '../uikit/Button';
import { shortenText } from '../utils/strings';

const TechnologiesSection = ({
    technologies,
    loading,
}) => {
    const renderTechnologyCard = (tech) => {
        if (tech.button) {
            // TODO: add href pointing to technologies page
            return (
                <a className="see-more-small" href="/"> 
                    {tech.label}
                </a>
            )
        }

        return (
            <a className="tech-card" href={tech.absolute_url}>
                <img src={tech.image_file.small} alt={tech.name} />
                <div className="tech-summary">
                    <h3>{tech.name}</h3>
                    <p>
                        {shortenText(tech.category[0].label, 0, 10)}...
                    </p>
                </div>
            </a>
        )
    }

    const renderFeaturedTechnologies = () => {
        let seeMoreButton = null;

        if (loading) {
            return <h3>Loading...</h3>;
        }

        if (technologies.length % 2 === 0) {
            seeMoreButton = (
                <a className="see-more-large">See more</a>
            );
        } else {
            technologies.push({
                button: true,
                label: 'See More'
            });
        }

        return (
            <React.Fragment>
                <div className="featured-tech-cards-container">
                    {technologies.map(tech => renderTechnologyCard(tech))}
                </div>
                {seeMoreButton}
            </React.Fragment>
        )
    }

    return (
        <div className="featured-technologies-container">
            <div className="featured-technologies-text">
                <h3>ADD TECHNOLOGIES</h3>
                <p>A broad group describing a specific topic</p>
            </div>
            <div className="add-technology">
                <img src="/static/imgs/technology.png" />
                <h2>
                    Be the first to add<br/>the technology<br/>that interests you
                </h2>
                <Button color="black">
                    + Add Technology
                </Button>
            </div>
            {renderFeaturedTechnologies()}
        </div>
    );
}

export default TechnologiesSection;