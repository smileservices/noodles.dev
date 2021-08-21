import React, {useEffect, useState, useCallback, useReducer, Fragment} from "react";
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

    useEffect(() => {
        if (state.expanded) {
            document.getElementById('sidebar').classList.add('expanded');
        } else {
            document.getElementById('sidebar').classList.remove('expanded');
        }
    }, [state.expanded]);

    const clickCategoryAction = (category) => {
        dispatch({type: SELECT_CATEGORY, payload: category});
    }

    return (
        <Fragment>
            <div className="categories">
                <h3 className="sidebar-title">Categories</h3>
                <CategoriesComponent clickAction={clickCategoryAction}/>
            </div>
            {state.expanded
                ? (
                    <Fragment>
                        <CategoryDetailComponent category={state.selectedCategory}/>
                        <div className="minimize" onClick={e => dispatch({type: MINIMIZE})}><span
                            className="icon-close"/></div>
                    </Fragment>
                )
                : ''}
        </Fragment>
    )
}

ReactDOM.render(<SidebarApp/>, document.getElementById('sidebar-app'));