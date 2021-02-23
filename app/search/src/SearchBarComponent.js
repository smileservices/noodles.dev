import React, {useState, useEffect, Fragment} from "react";

export default function SearchBarComponent({search, state}) {

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
            <div className="suggestions-list">
                {suggestions.map(r => <span key={r} onClick={e => {
                    search(r);
                    setFormData(r);
                    setShowSuggestions(false)
                }}>{r}</span>)}
            </div>
        )
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
                <span className="search-overlay">{waiting ? waiting : 'Press Enter'}</span>
                {showSuggestions ? <SuggestionsList suggestions={suggestions}/> : ''}
            </form>
        </div>
    )
}