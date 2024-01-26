const express = require('express')
const router = express.Router()
const todoRoute = require('./todoRoute')
const userRoute = require('./userRoute')

router.use('/todos', todoRoute)
router.use('/user', userRoute)

module.exports = router