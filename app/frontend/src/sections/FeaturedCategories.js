import React, { useState, useEffect } from "react";
import Card from "../uikit/Card";
import Button from '../uikit/Button';
import { FetchDataAndSetState } from '../../../src/api_interface/apiFetching'
import { HOMEPAGE_APIS } from '../utils/constants';

const FeaturedCategories = () => {
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    FetchDataAndSetState(
      HOMEPAGE_APIS.GET_FEATURED_CATEGORIES_API,
      setFeaturedCategories,
      setLoading,
    )
  }, []);

  const renderContent = () => {
    if (loading) {
      return <h3>Loading...</h3>;
    }

    return (
      <div className="featured-categories-cards-container">
        {featuredCategories.map((featured) => {
          return (
            <Card
                title={featured.name}
                description={featured.description}
                actions={(
                    <a href={featured.absolute_url}>View More</a>
                )}
            />
          );
        })}
      </div>
    );
  };

  return (
    <section className="featured-categories-section">
      <div className="featured-categories-section-title">
        <h3>FEATURED CATEGORIES</h3>
        <p>Each Category is a broad group describing a specific topic</p>
      </div>
      <div className="featured-categories-container">
        {renderContent()}
        <div class="call-to-action-container">
            <div className="call-to-action contribute-container">
                <img src="/static/imgs/help.png" />
                <h2>
                    Explore, learn from<br/> resources, and give back<br /> to the community.
                </h2>
                <Button color="black">Contribute</Button>
            </div>
            <div className="call-to-action add-tutorial-container">
                <img src="/static/imgs/teach-something.png" />
                <h2>
                    Want to teach something?
                </h2>
                <Button color="black">Add a tutorial</Button>
            </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
