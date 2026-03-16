import { useMediaQuery } from "./useMediaQuery";

interface Responsive {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
}

/**
 * A hook that provides information about the current screen size, it returns an object with three boolean properties: isMobile, isTablet and isDesktop. 
 */
export function useResponsive(): Responsive {
    const isMobile = useMediaQuery("(max-width: 639px)");
    const isTablet = useMediaQuery("(min-width: 640px) and (max-width: 1023px)");
    const isDesktop = useMediaQuery("(min-width: 1024px)");

    return { isMobile, isTablet, isDesktop };
}
