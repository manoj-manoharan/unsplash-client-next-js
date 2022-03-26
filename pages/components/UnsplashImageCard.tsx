import {UnsplashImageAPIObject} from "../types";

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