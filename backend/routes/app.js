const express = require('express');
const mongoose = require('mongoose');
const UserRoutes = require('./UserRoutes');
const MessageRouter = require('./MessageRouter')

const router = express.Router();
router.use(express.json());
router.use(UserRoutes)
router.use(MessageRouter)
module.exports = router;