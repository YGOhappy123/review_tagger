const tmdbService = require('../tmdb/service')

const DEFAULT_SERVER_ERROR_MSG = 'Oops! Something wrong!'

const personController = {
    getPersonMedias: async (req, res) => {
        try {
            const { personId } = req.params
            const response = await tmdbService.getPersonMedias({ personId })

            res.status(200).json({ data: response?.data })
        } catch (err) {
            res.status(500).json({
                message: err.message ?? DEFAULT_SERVER_ERROR_MSG
            })
        }
    },

    getPersonDetail: async (req, res) => {
        try {
            const { personId } = req.params
            const response = await tmdbService.getPersonDetail({ personId })

            res.status(200).json({ data: response?.data })
        } catch (err) {
            res.status(500).json({
                message: err.message ?? DEFAULT_SERVER_ERROR_MSG
            })
        }
    }
}

module.exports = personController
