const tmdbService = require('../tmdb/service')
const User = require('../models/User')
const Review = require('../models/Review')
const Favorite = require('../models/Favorite')
const verifyTokenMiddleware = require('../middlewares/verifyJWT')

const DEFAULT_SERVER_ERROR_MSG = 'Oops! Something wrong!'

const mediaController = {
    getMediaList: async (req, res) => {
        try {
            const { page } = req.query
            const { mediaType, mediaCategory } = req.params

            const response = await tmdbService.getMediaList({
                mediaType,
                mediaCategory,
                page
            })

            res.status(200).json({ data: response?.data })
        } catch (err) {
            res.status(500).json({
                message: err.message ?? DEFAULT_SERVER_ERROR_MSG
            })
        }
    },

    getGenres: async (req, res) => {
        try {
            const { mediaType } = req.params

            const response = await tmdbService.getMediaGenres({ mediaType })

            res.status(200).json({ data: response?.data })
        } catch (err) {
            res.status(500).json({
                message: err.message ?? DEFAULT_SERVER_ERROR_MSG
            })
        }
    },

    searchMedia: async (req, res) => {
        try {
            const { mediaType } = req.params
            const { query, page } = req.query

            const response = await tmdbService.getMediaSearch({
                query,
                page,
                mediaType: mediaType === 'people' ? 'person' : mediaType
            })

            res.status(200).json({ data: response?.data })
        } catch (err) {
            res.status(500).json({
                message: err.message ?? DEFAULT_SERVER_ERROR_MSG
            })
        }
    },

    getMediaDetail: async (req, res) => {
        try {
            const { mediaType, mediaId } = req.params
            const mediaParams = { mediaType, mediaId }

            const { data: media } = await tmdbService.getMediaDetail(
                mediaParams
            )

            const credits = await tmdbService.getMediaCredits(mediaParams)
            const videos = await tmdbService.getMediaVideos(mediaParams)
            const recommend = await tmdbService.getMediaRecommend(mediaParams)
            const images = await tmdbService.getMediaImages(mediaParams)

            media.credits = credits?.data
            media.videos = videos?.data
            media.recommend = recommend?.data?.results
            media.images = images?.data
            media.reviews = await Review.find({ mediaId })
                .populate('user')
                .sort({ createdAt: -1 })

            // Additional information if user logged in
            const decodedUserId = verifyTokenMiddleware.decodeToken(req)
            if (decodedUserId) {
                const user = await User.findById(decodedUserId)
                if (user) {
                    const isFavorite = await Favorite.findOne({
                        user: user._id,
                        mediaId
                    })
                    media.isFavorite = isFavorite !== null
                }
            }

            res.status(200).json({ data: media })
        } catch (err) {
            res.status(500).json({
                message: err.message ?? DEFAULT_SERVER_ERROR_MSG
            })
        }
    }
}

module.exports = mediaController
