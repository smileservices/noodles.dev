import React, { useState, useEffect } from "react";
import Card from "../uikit/Card";
import PaginationComponent from '../uikit/Pagination';
import apiFetch from '../../../src/api_interface/apiFetch'
import { HOMEPAGE_APIS } from '../utils/constants';

function render_name_with_path(name, path) {
    return path ? path + ' > ' + name : name
}

const FeaturedCategories = () => {
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiFetch(
      HOMEPAGE_APIS.GET_FEATURED_CATEGORIES_API,
      setFeaturedCategories,
      setLoading,
    )
  }, []);

  const renderContent = () => {
    if (loading) {
      return <h3>Loading...</h3>;
    }

    if (innerWidth <= 599) {
      return (
        <PaginationComponent
        resultsContainerClass="featured-categories-cards-container"
          data={featuredCategories.map((cat, index) => ({ ...cat, index }))}
          dataLimit={1}
          limit={4}
          mapFunction={
            (featured, id) => (
              <Card
                key={id}
                title={render_name_with_path(featured.name, featured.path)}
                description={featured.description}
                link={featured.url}
              />
            )
          }
        />
      )
    }

    return (
      <div className="featured-categories-cards-container">
        {featuredCategories.map((featured, id) => {
          return (
            <Card
                key={id}
                title={render_name_with_path(featured.name, featured.path)}
                description={featured.description}
                link={featured.url}
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
        <div className="call-to-action-container">
            <div className="call-to-action contribute-container">
                <img src="/static/imgs/help.png" />
                <h2>
                    Explore, learn from<br/> resources, and give back<br /> to the community.
                </h2>
                <a
                  className="btn dark"
                  href="/tutorials/create/"
                >
                  Contribute
                </a>
            </div>
            <div className="call-to-action add-tutorial-container">
                <img src="/static/imgs/teach-something.png" />
                <h2>
                    Want to teach something?
                </h2>
                <a
                  className="btn dark"
                  href="/tutorials/create/"
                >
                  Add a tutorial
                </a>
            </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
