import {UnsplashImageAPIObject} from "../types";
import Image from 'next/image'

const UnsplashImageCard = ({className, image}: { className : string, image: UnsplashImageAPIObject }) => {
    return (
        <>
            <img
                className={className}
                src={image.urls.regular}
                alt={image.alt_description}
            />
        </>
    );
}

export default UnsplashImageCard;