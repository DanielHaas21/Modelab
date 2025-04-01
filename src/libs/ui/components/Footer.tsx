import * as React from "react";
import { cn } from "../../utils";
interface FooterProps{
    className?: string;
    children?:React.ReactNode[];
}

export const Footer : React.FC<FooterProps> = (({className,children,...props}) => {
    return(
        <header
            className={cn({className},"d-flex flex-row justify-content-end align-items-center h-6-vh w-100 bg-white")}
            {...props}
        >
            {children}
            <div></div>
        </header>
    );
})


