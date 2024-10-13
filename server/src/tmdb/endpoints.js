const tmdbBaseUrl = process.env.TMDB_BASE_URL
const tmdbApiKey = process.env.TMDB_API_KEY

const generateURL = (endpoint, queryParams) => {
    const queries = new URLSearchParams(queryParams)

    return `${tmdbBaseUrl}/${endpoint}?api_key=${tmdbApiKey}&${queries}`
}

const tmdbEndpoints = {
    mediaList: ({ mediaType, mediaCategory, page }) =>
        generateURL(`${mediaType}/${mediaCategory}`, { page }),

    mediaDetail: ({ mediaType, mediaId }) =>
        generateURL(`${mediaType}/${mediaId}`),

    mediaGenres: ({ mediaType }) => generateURL(`genre/${mediaType}/list`),

    mediaCredits: ({ mediaType, mediaId }) =>
        generateURL(`${mediaType}/${mediaId}/credits`),

    mediaVideos: ({ mediaType, mediaId }) =>
        generateURL(`${mediaType}/${mediaId}/videos`),

    mediaRecommend: ({ mediaType, mediaId }) =>
        generateURL(`${mediaType}/${mediaId}/recommendations`),

    mediaImages: ({ mediaType, mediaId }) =>
        generateURL(`${mediaType}/${mediaId}/images`),

    mediaSearch: ({ mediaType, query, page }) =>
        generateURL(`search/${mediaType}`, { query, page }),

    personDetail: ({ personId }) => generateURL(`person/${personId}`),

    personMedias: ({ personId }) =>
        generateURL(`person/${personId}/combined_credits`)
}

module.exports = tmdbEndpoints
