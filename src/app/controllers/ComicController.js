const fetch = require('node-fetch')
const md5 = require('md5')
const db = require('../../config/db')
const Comic = require('../models/comic')

// const publicKey = '99b4f9d98ec986da4f92cb7ed1186f9e' // key 01
const publicKey = '6abe5513b645ff913b55e512953d9360' // key 02
// const privateKey = '28026d22020d9dffdb2b4625b434311275a4afeb' // key 01
const privateKey = '76e6a2253aba383c5e6a300bc909b0c48ed1fc4d' // key 02

const time = Number(new Date())

const hash = md5(time + privateKey + publicKey)

const limit = 30

module.exports = {
    index(req, res) { 

        let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 8
        let offset = limit * (page - 1)

        const params = {
            filter,
            page,
            limit,
            offset,
            callback(comics) {
                if(comics.length == 0){
                    return res.redirect("/")
                } 

                const pagination = {
                    total: Math.ceil(comics[0].total / limit),
                    page
                }

                return res.render("comics/index", { comics, pagination, filter })
            }
        }
        Comic.paginate(params)
    },
    show(req, res) {

        Comic.find(req.params.id, time, publicKey, hash, limit, (comic) => {
            if(!comic) return res.send("Comic not found!")

            comic[0].dates[0].date = new Date(comic[0].dates[0].date).toLocaleDateString()
            return res.render("comics/show", { comic })
        })
    },
    showCheckout(req, res) {
        Comic.find(req.params.id, time, publicKey, hash, limit, (comic) => {
            if(!comic) return res.send("Comic not found!")

            return res.render("comics/checkout", { comic })
        })
    }
}

fetch(`http://gateway.marvel.com/v1/public/comics?ts=${time}&apikey=${publicKey}&hash=${hash}&limit=${limit}&offset=0`)
.then(response => response.json())
.then(json => {
    const comics = json

    comics.data.results.forEach(async ({ id, title, thumbnail }) => {
        await db.query(`DELETE FROM comics WHERE is_created = '0'`)
        await db.query(`INSERT INTO comics (id, title, thumbnail, extension, is_created) values('${id}', '${title}', '${thumbnail.path}', '${thumbnail.extension}', '0')`)
        .catch(error => {
            console.log(error)
        })
    })
})
.catch(err => console.log(err))