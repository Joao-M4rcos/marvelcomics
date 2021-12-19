const db = require('../../config/db')
const fetch = require('node-fetch')

module.exports = {
    all(callback) {

        db.query(`
        SELECT
        FROM comics
        GROUP BY comics.id
        `, (err, results) => {
            if (err) throw `Database Error! ${err}`

            const comics = results.rows.map((comic) => {
                return {
                    ...comic
                }
            })
            callback(comics)

        })
    },
    find(id, time, publicKey, hash, limit, callback) {
        fetch(`http://gateway.marvel.com/v1/public/comics/${id}?ts=${time}&apikey=${publicKey}&hash=${hash}&limit=${limit}&offset=0`)
        .then(response => response.json())
        .then(json => {
            const comic = json
        
            // console.log(comic.data.results)
            callback(comic.data.results)
        })
    },
    paginate(params) {
        const { filter, limit, offset, callback } = params

        let query = "",
            filterQuery = "",
            totalQuery = `(
                SELECT count(*) FROM comics
            ) AS total`

        if (filter) {

            filterQuery = `
            WHERE comics.title ILIKE '%${filter}%'
            OR comics.title ILIKE '%${filter}%'
            `
            totalQuery = `(
                SELECT count(*) FROM comics
                ${filterQuery}
            ) AS total`
        }

        query = `SELECT *, ${totalQuery}
        FROM comics
        ${filterQuery}
        GROUP BY comics.id LIMIT $1 OFFSET $2
        `

        db.query(query, [limit, offset], (err, results) => {
            if (err) throw `Database Error! ${err}`

            const comics = results.rows.map((comic) => {
                return {
                    ...comic
                }
            })
            callback(comics)
        })
    }
}