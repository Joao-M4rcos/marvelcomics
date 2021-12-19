const fetch = require('node-fetch')
const md5 = require('md5')
const db = require('../../config/db')
const Comic = require('../models/comic')

const publicKey = '99b4f9d98ec986da4f92cb7ed1186f9e'
const privateKey = '28026d22020d9dffdb2b4625b434311275a4afeb'

const time = Number(new Date())

const hash = md5(time + privateKey + publicKey)

const total = 100

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
                const pagination = {
                    total: Math.ceil(comics[0].total / limit),
                    page
                }

                return res.render("comics/index", { comics, pagination, filter })
            }
        }
        Comic.paginate(params)
    }
}

fetch(`http://gateway.marvel.com/v1/public/comics?ts=${time}&apikey=${publicKey}&hash=${hash}&limit=${total}&offset=0`)
.then(response => response.json())
.then(json => {
    const comics = json

    comics.data.results.forEach(async ({id, title, description, thumbnail}) => {
        await db.query(`DELETE FROM comics WHERE is_created = '0'`)
        await db.query(`INSERT INTO comics (id, title, description, thumbnail, extension, is_created) values('${id}', '${title}', '${description}', '${thumbnail.path}', '${thumbnail.extension}', '0')`)
    })
})
.catch(err => console.log(err))