import React, {
  useEffect,
  useState,
  useCallback,
  useReducer,
  Fragment,
} from "react";
import ReactDOM from "react-dom";
import { makeId } from "../../../src/components/utils";
// import Tree from 'react-animated-tree'

import { SkeletonLoadingSidebar } from "../../../src/components/skeleton/SkeletonLoadingSidebar";

const URL = "/sidebar/";

const FETCH_INIT = "FETCH_CATEGORIES";
const FETCH_SUCCESS = "FETCH_SUCCESS";
const FETCH_ERROR = "FETCH_ERROR";

const initialState = {
  waiting: true,
  errors: false,
  categories: [],
};

function TreeComponent({
  content,
  children,
  isExpanded,
  clickAction,
  descendantCount,
  selectedCategory,
}) {
  const [expanded, setExpanded] = useState(isExpanded && children.length > 0);

  const expander = () => {
    if (!children) return "";
    return (
      <span
        className={`${
          expanded ? "icon-arrow_drop_down" : "icon-arrow_right"
        } expander`}
        key={makeId(4)}
        onClick={(e) => {
          e.stopPropagation();
          setExpanded(!expanded);
        }}
      ></span>
    );
  };
  const id = makeId(4);
  const className = `parent ${expanded ? "expanded" : ""} ${
    selectedCategory === content ? "open-details" : ""
  }`;

  return (
    <ul className="tree">
      <li key={id} onClick={clickAction} id={id}>
        {expander()}
        <div className={className}>
          <span>{content}</span>
          <span>{descendantCount}</span>
        </div>
      </li>
      {expanded && children.length > 0 ? (
        <li className="children">{children}</li>
      ) : (
        ""
      )}
    </ul>
  );
}

function renderCategoryTree(category, clickAction, selectedCategory) {
  let content = category.name;
  let descendantCount = null;
  if (category.children.length > 0)
    descendantCount = category.descendants_count;
  return (
    <TreeComponent
      key={makeId(4)}
      content={content}
      children={
        category.children.length > 0
          ? category.children.map((cat) =>
              renderCategoryTree(cat, clickAction, selectedCategory)
            )
          : false
      }
      isExpanded={true}
      clickAction={(e) => clickAction(category)}
      descendantCount={descendantCount}
      selectedCategory={selectedCategory}
    />
  );
}

const reducer = (state, { type, payload }) => {
  switch (type) {
    case FETCH_INIT:
      return {
        waiting: true,
        errors: false,
        categories: [],
      };
    case FETCH_SUCCESS:
      return {
        waiting: false,
        errors: false,
        categories: payload,
      };
    case FETCH_ERROR:
      return {
        waiting: false,
        errors: payload,
        categories: [],
      };
  }
};

export default function CategoriesComponent({ clickAction, selectedCategory }) {
  const [state, dispatch] = useReducer(reducer, { ...initialState });

  useEffect((e) => {
    /*
     * data should be like: {featured: {category: [{logo: ..., name: ..., url: ...}, ...], category2: ...}, other: {...same structure...}}
     *
     * */
    fetch(URL, {
      method: "GET",
    })
      .then((result) => {
        dispatch({ type: FETCH_INIT });
        if (result.ok) {
          return result.json();
        } else {
          dispatch({
            type: FETCH_ERROR,
            payload: ["Could not read data: " + result.statusText],
          });
        }
      })
      .then((data) => {
        dispatch({ type: FETCH_SUCCESS, payload: data.categories });
      })
      .catch((err) => {
        dispatch({ type: FETCH_ERROR, payload: [err] });
      });
  }, []);

  if (state.waiting) return SkeletonLoadingSidebar;
  if (state.errors)
    return (
      <ul className="errors">
        {state.errors.map((err) => (
          <li key={makeId(4)}>{err}</li>
        ))}
      </ul>
    );

  return (
    <Fragment>
      {state.categories.map((category) =>
        renderCategoryTree(category, clickAction, selectedCategory)
      )}
    </Fragment>
  );
}
