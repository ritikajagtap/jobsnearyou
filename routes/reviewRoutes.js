const reviewController = require(`${__dirname}/../controllers/reviewController`);
const authController = require(`${__dirname}/../controllers/authController`);

const express = require('express');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );

router
  .route('/:id')
  .patch(reviewController.updateReview)
  .get(reviewController.getReview)
  .delete(reviewController.deleteReview);

//POST /job/239riehfj/reviews
//GET /job/239riehfj/reviews
//GET /job/239riehfj/reviews/wfbhe221938

module.exports = router;
