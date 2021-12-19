const express = require('express')
const routes = express.Router()
const ComicController = require('./app/controllers/ComicController')

routes.get("/", (req, res) => {
    return res.redirect("/comics")
})

routes.get('/comics', ComicController.index)

module.exports = routes