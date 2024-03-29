import React, {useState, useEffect, useRef} from "react";

export default function SearchBarComponentWithInstantResults({setSearchTerm, searchTerm, placeholder}) {
    /*
    * search - search function to be executed when submiting search
    * state - {q: search term, placeholder: placeholder text}
    *
    * */

    const [formData, setFormData] = useState(searchTerm);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [waiting, setWaiting] = useState('');
    const searchInputRef = useRef(null);
    const controller = new AbortController();

    useEffect(e=>{
        searchInputRef.current.focus();
    })

    useEffect(e => {
        if (formData.length > 1 && searchTerm !== formData) {
            fetch('/search/api/autocomplete/' + formData + '/', {
                method: "GET",
                signal: controller.signal
            }).then(result => {
                setWaiting('');
                if (result.ok) {
                    return result.json();
                } else {
                    alert('Could not read data: ' + result.statusText)
                }
            }).then(data => {
                if (data && data.items.length > 0) {
                    console.log(data.items);
                    setShowSuggestions(true)
                    setSuggestions(data.items);
                } else {
                    setShowSuggestions(false)
                }
            }).catch(err => {
                if (err.name === 'AbortError') {
                    console.log('Fetch was aborted');
                }
            });
            return e => controller.abort();
        } else {
            setShowSuggestions(false);
        }
    }, [formData])

    function SuggestionsList({suggestions}) {
        return (
            <div className="suggestions-list card">
                <header>Live Results:</header>
                {suggestions.map(s=> <a key={s.url} href={s.url}>{s.name}</a>)}
            </div>
        )
    }

    function searchOverlayContent(content, waiting) {
        if (waiting) {
            return waiting;
        }
        if (content) return (<span className="clear" onClick={e=>{
            setFormData('');
            setSearchTerm('');
        }}><span className="icon-cancel"/></span>);
    }

    return (
        <div className="search-bar-big">
            <form onSubmit={e => {
                e.preventDefault();
                setSearchTerm(formData);
                setShowSuggestions(false);
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
                <span className="search-overlay">{searchOverlayContent(formData, waiting)}</span>
                {showSuggestions ? <SuggestionsList suggestions={suggestions}/> : ''}
            </form>
        </div>
    )
}