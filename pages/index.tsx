import {has, get} from 'lodash';
import {KeyboardEvent, useCallback, useEffect, useState} from "react";

import styles from '../styles/Home.module.css'
import {UnsplashImageAPIObject} from "./types";
import ResponsiveMasonry from "./components/ResponsiveMasonry";
import Masonry from "./components/Masonary";
import UnsplashImageCard from "./components/UnsplashImageCard";


const Home = () => {

    const [page, setPage] = useState(1);
    const [searchText, setSearchText] = useState("");
    const images = useImagesApiHandler(page, searchText);
    const scrollPosition = useScrollPosition();

    const handleSearch = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            setSearchText(event.currentTarget.value);
            setPage(1);
        }
    }

    const getNextPage = useCallback(() => {
        setPage(prev => {
            return prev + 1;
        })
    }, []);

    // Calls getNextPage when bottom of the view port is reached
    useOnReachViewportBottom(scrollPosition, getNextPage);

    return (
        <div className={styles['main']}>
            <input className={styles["search-box"]} placeholder='Search' onKeyUp={handleSearch}/>
            <div className={styles["image-list"]}>
                <ResponsiveMasonry columnsCountBreakPoints={{400: 1, 800: 2, 1200: 3}}>
                    <Masonry>
                        {images.map((image: UnsplashImageAPIObject, index) => {
                            return <UnsplashImageCard key={image.id + index} className={styles.img} image={image}/>;
                        })}
                    </Masonry>
                </ResponsiveMasonry>
            </div>
            <button className={styles["button"]} onClick={getNextPage}>Show more</button>
        </div>
    );
}

const useImagesApiHandler = (page: number, searchText: string) => {

    const [images, setImages] = useState([]);

    const apiUrl = useBuildApiUrl(page, searchText);
    const fetchedImages = useFetchImages(apiUrl)

    // When user searches for a new name, clear all old images fetches from array
    useEffect(() => {
        setImages([])
    }, [searchText])

    // When new images fetched append to the existing array
    useEffect(() => {
        setImages((prev) => {
            return [...prev, ...fetchedImages]
        })
    }, [fetchedImages, setImages])

    return images;
}

const useBuildApiUrl = (page: number, searchText: string, perPage = 20): string => {

    const [apiUrl, seApiUrl] = useState("");

    useEffect(() => {

        const authQueryParams = "client_id=eXZJk7ov2lWxpiKvfH3e90W85ycxZCtdTh54ahJsJro";

        const baseUrl = `https://api.unsplash.com/`;

        const listPhotosUrl = `${baseUrl}/photos?`;
        const searchPhotosUrl = `${baseUrl}/search/photos?`;

        let finalApiUrl = listPhotosUrl;

        if (searchText.length > 0) {
            finalApiUrl = `${searchPhotosUrl}&query=${searchText}`;
        }

        seApiUrl(`${finalApiUrl}&${authQueryParams}&page=${page}&per_page=${perPage}`);

    }, [page, searchText, perPage])

    return apiUrl;
}

const useFetchImages = (apiUrl: string) => {

    const [fetchedImages, setFetchedImages] = useState([]);

    const getFormattedJsonFromApiResponse = (jsonResponse: any) => {
        return has(jsonResponse, 'results')
            ? get(jsonResponse, 'results', [])
            : jsonResponse;
    }

    useEffect(() => {
        (async () => {
            const apiResponse = await fetch(apiUrl);
            const jsonFromApi = await apiResponse.json()
            setFetchedImages(getFormattedJsonFromApiResponse(jsonFromApi));
        })();
    }, [apiUrl]);

    return fetchedImages;
}

const useScrollPosition = () => {

    let [scrollPosition, setScrollPosition] = useState('');

    const onScroll = () => {

        let documentHeight = document.body.scrollHeight;
        let currentScroll = window.scrollY + window.innerHeight;
        let modifier = 1000;

        if (currentScroll + modifier > documentHeight) {
            setScrollPosition("bottom");
            return;
        }

        setScrollPosition("not_bottom");
    }

    useEffect(() => {
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, [])

    return scrollPosition;
}

const useOnReachViewportBottom = (scrollPosition: string, callbackToRun: Function) => {
    useEffect(() => {
        if (scrollPosition === "bottom") {
            callbackToRun();
        }
    }, [scrollPosition, callbackToRun]);
}

export default Home;
