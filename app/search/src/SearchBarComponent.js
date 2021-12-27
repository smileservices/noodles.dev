import React, {useState, useEffect, useRef} from "react";

export default function SearchBarComponentWithInstantResults({setSearchTerm, searchTerm, placeholder}) {
    /*
    * search - search function to be executed when submiting search
    * state - {q: search term, placeholder: placeholder text}
    *
    * */

    const [formData, setFormData] = useState(searchTerm);
    const searchInputRef = useRef(null);

    useEffect(e => {
        searchInputRef.current.focus();
    })

    return (
        <div className="search-bar-big">
            <form onSubmit={e => {
                e.preventDefault();
                setSearchTerm(formData);
            }}>
                <input type="text"
                       className="search-input"
                       placeholder={placeholder}
                       value={formData}
                       onChange={e => {
                           setFormData(e.target.value)
                       }}
                       ref={searchInputRef}
                />
                <span className="search-overlay">
                    {formData ?
                        <span className="clear" onClick={e => {setFormData(''); setSearchTerm('');}}>
                        <span className="icon-cancel"/></span>
                    : ''}
                </span>
            </form>
        </div>
    )
}