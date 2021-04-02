import React, {useState, useEffect, Fragment} from "react";

export default function SearchBarComponent({search, state}) {
    /*
    * search - search function to be executed when submiting search
    * state - {q: search term, placeholder: placeholder text}
    *
    * */

    const [formData, setFormData] = useState(state.q);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [waiting, setWaiting] = useState('');

    const controller = new AbortController();

    useEffect(e => {
        if (formData.length > 1 && state.q !== formData) {
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
                if (data && data.length > 0) {
                    setShowSuggestions(true)
                    setSuggestions(data);
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
                <header>Search Suggestions:</header>
                {suggestions.map(r => <span key={r} onClick={e => {
                    search(r);
                    setFormData(r);
                    setShowSuggestions(false)
                }}>{r}</span>)}
            </div>
        )
    }

    function searchOverlayContent(content, waiting){
        if (waiting) {
            return waiting;
        }
        if (content) return (<span className="clear" onClick={e=>{
            setFormData('');
        }}>Clear Search <span className="icon-cancel"/></span>);
    }

    return (
        <div className="search-bar-big">
            <form onSubmit={e => {
                e.preventDefault();
                search(formData);
                setShowSuggestions(false);
            }}>
                <input type="text"
                       className="form-control"
                       placeholder={state.placeholder}
                       value={formData}
                       onChange={e => {
                           setFormData(e.target.value)
                       }}
                />
                <span className="search-overlay">{searchOverlayContent(formData, waiting)}</span>
                {showSuggestions ? <SuggestionsList suggestions={suggestions}/> : ''}
            </form>
        </div>
    )
}