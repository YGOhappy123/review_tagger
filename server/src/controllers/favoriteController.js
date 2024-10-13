const Favorite = require('../models/Favorite')

const DEFAULT_SERVER_ERROR_MSG = 'Oops! Something wrong!'

const favoriteController = {
    addToFavorite: async (req, res) => {
        try {
            const favorite = await Favorite.findOne({
                mediaId: req.body.mediaId,
                user: req.userId
            })

            if (favorite) {
                return res.status(200).json({
                    message: 'This media is already in your favorite',
                    data: favorite
                })
            }

            const newFavorite = await Favorite.create({
                ...req.body,
                user: req.userId
            })

            res.status(201).json({
                message: 'Added to favorite',
                data: newFavorite
            })
        } catch (err) {
            res.status(500).json({
                message: err.message ?? DEFAULT_SERVER_ERROR_MSG
            })
        }
    },

    removeFromFavorite: async (req, res) => {
        try {
            const { favoriteId } = req.params

            const deletedDocument = await Favorite.findOneAndDelete({
                _id: favoriteId,
                user: req.userId
            })
            if (!deletedDocument) {
                return res.status(401).json({ message: 'Favorite not found' })
            }

            res.status(200).json({ message: 'Favorite deleted successfully' })
        } catch (err) {
            res.status(500).json({
                message: err.message ?? DEFAULT_SERVER_ERROR_MSG
            })
        }
    },

    getUserFavorites: async (req, res) => {
        try {
            const favorites = await Favorite.find({ user: req.userId }).sort({
                createdAt: -1
            })

            res.status(200).json({ data: favorites })
        } catch (err) {
            res.status(500).json({
                message: err.message ?? DEFAULT_SERVER_ERROR_MSG
            })
        }
    }
}

module.exports = favoriteController
