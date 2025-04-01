import * as React from "react";
import {CoverImage, Preloader} from '../../libs/ui/components'; // UI components
import {DecideImageSize} from '../../libs/utils';
import { img } from "../../libs/types/size";
import { BaseLayout } from "../../libs/ui/layouts";
import { Link } from "react-router-dom";

const LandingPage : React.FC = () => {
    const [size, setSize] = React.useState<img | null>(null);

    React.useEffect(() => {
        setSize(DecideImageSize());
    }, []);

    if (!size) return <Preloader></Preloader>; 

    return( 
        <BaseLayout>
            <div className="d-flex flex-row bg-black h-86-vh">
                <div className="d-flex flex-column justify-content-end align-items-center overflow-hidden">
                    <h2 className="text-white kanit-light text-left w-100 ms-20 mt-5 fs-10">Welcome to Modelab</h2>
                    <div className="w-60 h-100 d-flex justify-content-center align-items-end">
                        <CoverImage className="w-100 object-fit-contain zoom-120" size={size}></CoverImage>
                    </div>
                </div>
            </div>
        </BaseLayout>
    );
}

export default LandingPage;