require('dotenv').config()
const express = require('express')
const app = express()
const mongodb = require('mongodb')
const bodyParser = require('body-parser')
const MongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID

const port = process.env.PORT || 3000
const MONGOSERVER = process.env.MONGOSERVER || 'mongodb://localhost:27017/irango'
let database

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded())

const insert = (db, collectionName, doc) => {
    return new Promise((resolve, reject) => {
        const collection = db.collection(collectionName)
        collection.insert(doc, (err, result) => {
            if (err)
                reject(err)
            else
                resolve(result)
        })
    })
}

const find = (db, collectionName, filter) => {
    return new Promise((resolve, reject) => {
        const collection = db.collection(collectionName)
        const cursor = collection.find(filter)
        const results = []
        cursor.forEach(doc => results.push(doc), err => {
            if (err)
                reject(err)
            else
                resolve(results)
        })
    })
}

const deleteOne = (db, collectionName, filter) => {
    return new Promise((resolve, reject) => {
        const collection = db.collection(collectionName)
        collection.deleteOne(filter, (err, results) => {
            if (err)
                reject(err)
            else
                resolve(results)
        })
    })

}

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/restaurantes', async (req, res) => {
    const restaurantes = await find(database, 'restaurantes', {})
    res.render('restaurantes', { restaurantes })
})

app.get('/restaurantes/novo', (req, res) => {
    res.render('restaurante_novo')
})

app.post('/restaurantes/novo', async (req, res) => {
    const restaurante = {
        nome: req.body.nome,
        loc: {
            type: 'Point',
            coordinates: [parseFloat(req.body.lng), parseFloat(req.body.lat)]
        }
    }
    await insert(database, 'restaurantes', restaurante)
    res.redirect('/restaurantes')
})

app.get('/restaurantes/delete/:id', async (req, res) => {
    await deleteOne(database, 'restaurantes', {
        _id: ObjectID(req.params.id)
    })
    res.redirect('/restaurantes')
})

app.get('/restaurantes/distancia', (req, res) => {
    const { lat, lng } = req.query
    if (!lat || !lng)
        res.render('restaurante_distancia_map')
    else {
        database.command({
            geoNear: 'restaurantes',
            near: [parseFloat(lng), parseFloat(lat)],
            spherical: true,
            distanceMultiplier: 6378.1
        }, (err, results) => {
            res.render('restaurantes_distancia', { results, lat, lng })
        })
    }
})

app.get('/api/restaurantes/distancia', (req, res) => {
    const { lat, lng } = req.query
    if (!lat || !lng)
        res.send([])
    else {
        database.command({
            geoNear: 'restaurantes',
            near: [parseFloat(lng), parseFloat(lat)],
            spherical: true,
            distanceMultiplier: 6378.1
        }, (err, results) => {
            const positions = results.results.map(r => {
                return {
                    lat: r.obj.loc.coordinates[1],
                    lng: r.obj.loc.coordinates[0],
                    dis: r.dis,
                    nome: r.obj.nome
                }
            })
            res.send(positions)
        })
    }
})

MongoClient.connect(MONGOSERVER, (err, db) => {
    if (err)
        console.log(err)
    else {
        database = db

        const restaurantes = db.collection('restaurantes')
        restaurantes.createIndex({ loc: '2dsphere' })

        app.listen(port, () => console.log('iRango Server Running...'))
    }
})
