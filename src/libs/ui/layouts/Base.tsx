import * as React from "react";
import {Header} from "../components/Header";
import { Footer } from "../components";

interface BaseProps{
    children?: React.ReactNode;
}

export const BaseLayout : React.FC<BaseProps> = ({children}) => {
    return(
        <>
            <Header></Header>
            {children}
            <Footer></Footer>
        </>
    );
}
