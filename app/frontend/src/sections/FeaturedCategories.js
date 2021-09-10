import React, { useState, useEffect } from "react";
import Card from "../uikit/Card";
import Button from '../uikit/Button';

const GET_FEATURED_CATEGORIES_API = "/concepts/api/category/featured/";

const FeaturedCategories = () => {
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(GET_FEATURED_CATEGORIES_API)
      .then((result) => {
        if (result.ok) {
          return result.json();
        }
      })
      .then((data) => {
        const { results } = data;
        if (results && results.length) {
          setFeaturedCategories(results);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
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
                    <a>View More</a>
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
