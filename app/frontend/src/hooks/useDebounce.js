import { useState, useEffect } from 'react';

export default function useDebounce(value, delay) {
    const [debouncedQuery, setDebouncedQuery] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        }
    }, [value, delay]);

    return debouncedQuery;
}