const express = require('express')
const app = express()
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const port = process.env.PORT || 3000
let database

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('index')
})

const insert = (db, collectioName, doc) => {
    return new Promise((resolve, reject) => {
        const collection = db.collection(collectioName)
        collection.insert(doc, (err, result) => {
            if (err)
                reject(err)
            else
                resolve(result)
        })
    })
}

MongoClient.connect('mongodb://localhost:27017/irango', (err, db) => {
    database = db
    app.listen(port, () => console.log('iRango Server Running...'))
})
