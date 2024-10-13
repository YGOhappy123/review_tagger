const express = require('express')
const personController = require('../controllers/personController')

const router = express.Router()

router.get('/:personId/medias', personController.getPersonMedias)
router.get('/:personId', personController.getPersonDetail)

module.exports = router
