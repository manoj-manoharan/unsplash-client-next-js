import {UnsplashImageAPIObject} from "../types";

const UnsplashImageCard = ({image}: { image: UnsplashImageAPIObject }) => {
    return (
        <>
            <img
                src={image.urls.regular}
                alt={image.alt_description}
            />
        </>
    );
}

export default UnsplashImageCard;