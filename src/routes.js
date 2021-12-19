const express = require('express')
const ComicController = require('./app/controllers/ComicController')
const routes = express.Router()
const db = require('../src/config/db')

routes.get("/", (req, res) => {
    return res.redirect("/comics")
})

routes.get('/comics', ComicController.index)
routes.get('/comics/:id', ComicController.show)

module.exports = routes