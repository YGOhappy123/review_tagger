const axiosIns = require('../libs/axios')
const tmdbEndpoints = require('./endpoints')

const tmdbService = {
    getMediaList: async ({ mediaType, mediaCategory, page }) =>
        await axiosIns.get(
            tmdbEndpoints.mediaList({ mediaType, mediaCategory, page })
        ),

    getMediaDetail: async ({ mediaType, mediaId }) =>
        await axiosIns.get(tmdbEndpoints.mediaDetail({ mediaType, mediaId })),

    getMediaGenres: async ({ mediaType }) =>
        await axiosIns.get(tmdbEndpoints.mediaGenres({ mediaType })),

    getMediaCredits: async ({ mediaType, mediaId }) =>
        await axiosIns.get(tmdbEndpoints.mediaCredits({ mediaType, mediaId })),

    getMediaVideos: async ({ mediaType, mediaId }) =>
        await axiosIns.get(tmdbEndpoints.mediaVideos({ mediaType, mediaId })),

    getMediaImages: async ({ mediaType, mediaId }) =>
        await axiosIns.get(tmdbEndpoints.mediaImages({ mediaType, mediaId })),

    getMediaRecommend: async ({ mediaType, mediaId }) =>
        await axiosIns.get(
            tmdbEndpoints.mediaRecommend({ mediaType, mediaId })
        ),

    getMediaSearch: async ({ mediaType, query, page }) =>
        await axiosIns.get(
            tmdbEndpoints.mediaSearch({ mediaType, query, page })
        ),

    getPersonDetail: async ({ personId }) =>
        await axiosIns.get(tmdbEndpoints.personDetail({ personId })),

    getPersonMedias: async ({ personId }) =>
        await axiosIns.get(tmdbEndpoints.personMedias({ personId }))
}

module.exports = tmdbService
