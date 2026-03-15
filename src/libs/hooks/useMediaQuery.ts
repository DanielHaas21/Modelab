import { useState, useEffect } from "react";

/**
 * A hook that listens to a media query and returns a boolean indicating whether the query matches the current screen size.
 * @param query 
 * @returns 
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        const listener = () => setMatches(media.matches);
        listener();
        media.addEventListener("change", listener);
        return () => media.removeEventListener("change", listener);
    }, [query]);

    return matches;
}
