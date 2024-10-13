const express = require('express')
const { verifyJWT } = require('../middlewares/verifyJWT')

const reviewController = require('../controllers/reviewController')

const router = express.Router()

router.get('/', verifyJWT, reviewController.getUserReviews)
router.post('/', verifyJWT, reviewController.addReview)
router.delete('/:reviewId', verifyJWT, reviewController.removeReview)

module.exports = router
