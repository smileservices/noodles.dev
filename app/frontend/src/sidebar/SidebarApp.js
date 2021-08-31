import React, {useEffect, useState, useReducer, Fragment} from "react";
import ReactDOM from "react-dom";
import CategoriesComponent from "./CategoriesComponent";
import CategoryDetailComponent from "./ CategoryDetailComponent";

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

    useEffect(() => {
        console.log(state.expanded);
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
        if (innerWidth > 600) {
            document.querySelector('body').classList.toggle('sidebar-visible');
        } else {
            document.querySelector('body').classList.toggle('sidebar-visible-mobile');
        }
    };

    return (
        <Fragment>
            <div className="categories">
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