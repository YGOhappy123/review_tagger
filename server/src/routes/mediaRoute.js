const express = require('express')
const mediaController = require('../controllers/mediaController')

const router = express.Router({ mergeParams: true })

router.get('/genres', mediaController.getGenres)
router.get('/search', mediaController.searchMedia)
router.get('/detail/:mediaId', mediaController.getMediaDetail)
router.get('/:mediaCategory', mediaController.getMediaList)

module.exports = router
