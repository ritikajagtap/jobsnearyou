const express = require('express');
const router = express.Router();
const viewsController = require(`${__dirname}/../controllers/viewsController`);
const authController = require(`${__dirname}/../controllers/authController`);
router.get('/login', viewsController.getLoginForm);
router.get('/section', viewsController.getBase);
router.get('/home', viewsController.getOverview);
router.get('/jobs/:slug', authController.protect, viewsController.getJob);


module.exports = router;
