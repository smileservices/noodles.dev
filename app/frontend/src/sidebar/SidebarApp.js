import React, { useEffect, useState, useReducer, Fragment, useRef } from "react";
import ReactDOM from "react-dom";
import CategoriesComponent from "./CategoriesComponent";
import CategoryDetailComponent from "./ CategoryDetailComponent";
import { toggleSidebarUtil } from '../utils/DOMUtils';
import {handleClickOutside} from "../../../src/components/utils";


const SELECT_CATEGORY = 'SELECT_CATEGORY';
const MINIMIZE = 'MINIMIZE';

const initialState = {
    expanded: false,
    selectedCategory: null,
}

const reducer = (state, {type, payload}) => {
    switch (type) {
        case SELECT_CATEGORY:
            return {
                expanded: true,
                selectedCategory: payload
            }
        case MINIMIZE:
            return {...initialState}
    }
}

function SidebarApp() {
    /*
    * Get the categories tree
    * == When user click on category:
    *    - show child categories
    *    - expand sidebar to the right
    *    - show description and big name on the right part
    *    - fetch related technologies and articles
    * - has "x" button to minimize to the left
    *
    * */
    const [state, dispatch] = useReducer(reducer, {...initialState});
    const [selectedCategory, setSelectedCategory] = useState(null);
    const wrapperRef = useRef(null);
    // useOutsideAlerter(wrapperRef);
    handleClickOutside(wrapperRef, ()=>{
        const sidebarOpen = document.querySelector('body.sidebar-visible aside.sidebar');
        const categoryDetailOpen = document.querySelector('.category-detail');
        const mobileSidebarOpen = document.querySelector('body.sidebar-visible-mobile aside.sidebar');
        const mobileCategoryDetailOpen = document.querySelector('.category-detail');
        if (sidebarOpen && !categoryDetailOpen || mobileSidebarOpen && !mobileCategoryDetailOpen) {
            toggleSidebarUtil();
        }
    })

    useEffect(() => {
        if (state.expanded) {
            document.getElementById('sidebar').classList.add('expanded');
        } else {
            document.getElementById('sidebar').classList.remove('expanded');
        }
    }, [state.expanded]);

    const clickCategoryAction = (category) => {
        setSelectedCategory(category.name);
        dispatch({type: SELECT_CATEGORY, payload: category});
    }

    const onClickClose = () => {
        setSelectedCategory(null);
        dispatch({type: MINIMIZE});
    }

    const onClickToggleSidebar = () => {
        toggleSidebarUtil();
    };

    return (
        <Fragment>
            <div className="categories" ref={wrapperRef}>
                <div className="top-section">
                    <a href="/" className="navbar-logo">Noodles.<span className="blue-text">dev</span></a>
                    <a href="#" rel="nofollow noopener" onClick={onClickToggleSidebar} className="collapse-button">
                        <span className="icon-close close-icon" />
                    </a>
                </div>
                <h3 className="sidebar-title">Categories</h3>
                <CategoriesComponent selectedCategory={selectedCategory} clickAction={clickCategoryAction}/>
            </div>
            {state.expanded
                ? (
                    <Fragment>
                        <CategoryDetailComponent onClickClose={onClickClose} category={state.selectedCategory}/>
                    </Fragment>
                )
                : ''}
        </Fragment>
    )
}

ReactDOM.render(<SidebarApp/>, document.getElementById('sidebar-app'));