import * as React from "react";
import {CoverImage, Preloader} from '../../libs/ui/components'; // UI components
import {DecideImageSize} from '../../libs/utils';
import { img } from "../../libs/types/size";
import { BaseLayout } from "../../libs/ui/layouts";

const LandingPage : React.FC = () => {
    const [size, setSize] = React.useState<img | null>(null);

    React.useEffect(() => {
        setSize(DecideImageSize());
    }, []);

    if (!size) return <Preloader></Preloader>; 

    return( 
        <BaseLayout>
            <div className="d-flex flex-row bg-black h-80-vh">
                <div className="d-flex flex-column justify-content-end align-items-center overflow-hidden h-80-vh">
                    <h2 className="text-white kanit-light text-left w-100 ms-5 mt-5 fs-10">Welcome to Modelab</h2>
                    <CoverImage className="w-60 h-80-vh object-fit-contain ms-5 zoom-120 cover-image" size={size}></CoverImage>
                </div>
            </div>
        </BaseLayout>
    );
}

export default LandingPage;