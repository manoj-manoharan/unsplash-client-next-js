import type {NextApiRequest, NextApiResponse} from 'next'
import {get, has} from "lodash";
import axios from "axios";
import {UnsplashImageAPIObject} from "../../types";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<UnsplashImageAPIObject[]>
) {
    switch (req.method) {
        case 'GET':

            const page = (typeof req.query.page === "string")
                ? parseInt(req.query.page)
                : 1;

            const searchText = (typeof req.query.search_text === "string")
                ? req.query.search_text
                : "";

            res.json(await getUnsplashImages(page, searchText));

            break;

        default:
            res.status(404);
    }
    return;
}

const getUnsplashImages = async (
    page = 1,
    searchText = "",
    perPage = 20
): Promise<UnsplashImageAPIObject[]> => {

    let imagesList = [];

    const authQueryParams = `client_id=${process.env.CLIENT_ID}`;

    const baseUrl = `https://api.unsplash.com/`;

    const listPhotosUrl = `${baseUrl}/photos?`;
    const searchPhotosUrl = `${baseUrl}/search/photos?`;

    let finalApiUrl = listPhotosUrl;

    if (searchText && searchText.length > 0) {
        finalApiUrl = `${searchPhotosUrl}&query=${searchText}`;
    }

    finalApiUrl = `${finalApiUrl}&${authQueryParams}&page=${page}&per_page=${perPage}`;

    const response = await axios.get(finalApiUrl);

    if (response.status === 200) {
        imagesList = getFormattedJsonFromApiResponse(response.data);
    }

    return imagesList;
}

const getFormattedJsonFromApiResponse = (jsonResponse: any) => {
    return has(jsonResponse, 'results')
        ? get(jsonResponse, 'results', [])
        : jsonResponse;
}
