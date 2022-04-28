const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/heroes_correction')

const heroesSchema = mongoose.Schema({
	slug: String,
	name: String,
	power: [String],
	color: String,
	isAlive: Boolean,
	age: Number,
	image: String
})

const HeroesModel = mongoose.model('Heroes', heroesSchema)

const app = express()

app.use(morgan())
app.use(cors())
app.use(express.json())

app.get('/heroes', async (req, res) => {
    const heroes = await HeroesModel.find().exec()
    res.json(heroes)
})

app.get('/heroes/:slug', async (req, res) => {
    const hero = await HeroesModel.find({
        slug: req.params.slug
    }).exec()
    res.json(hero)
})

app.get('/heroes/:slug/powers', async (req, res) => {
    const hero = await HeroesModel.findOne({
        slug: req.params.slug
    }).exec()
    res.json(hero.power)
})

app.post('/heroes', (req, res, next) => {
    HeroesModel.find({
        slug: req.body.slug
    }).exec()
        .then((heroes) => {
            if (heroes.length) {
                res.status(400).send('There already is an hero with this slug')
            } else {
                next()
            }
        })
        .catch(() => res.status(500).send('An error occured'))
}, (req, res) => {
    HeroesModel.create(req.body)
        .then((hero) => res.json(hero))
        .catch(() => res.status(500).send('An error occured'))
})

app.put('/heroes/:slug/powers', (req, res) => {
    HeroesModel.updateOne({
        slug: req.params.slug
    }, {
        $push: {
            power: req.body
        }
    })
        .then(() => {
            HeroesModel.findOne({
                slug: req.params.slug
            })
                .then((hero) => res.json(hero))
                .catch(() => res.status(500).send('An error occured'))
        })
        .catch(() => res.status(500).send('An error occured'))
})

app.delete('/heroes/:slug', (req, res, next) => {
    HeroesModel.find({
        slug: req.params.slug
    }).exec()
        .then((heroes) => {
            if (heroes.length) {
                next()
            } else {
                res.status(400).send('There is no hero with this slug')
            }
        })
        .catch(() => res.status(500).send('An error occured'))
}, (req, res) => {
    HeroesModel.findOneAndDelete({
        slug: req.params.slug
    }).exec()
        .then((hero) => {
            res.json({
                message: `${hero.name} effacé correctement`
            })
        })
        .catch(() => res.status(500).send('An error occured'))
})

app.delete('/heroes/:slug/powers/:power', (req, res) => {
    HeroesModel.findOneAndUpdate({
        slug: req.params.slug
    }, {
        $pull: {
            power: req.params.power
        }
    }, { new: true }).exec()
        .then((hero) => res.json(hero))
        .catch(() => res.status(500).send('An error occured'))
})

app.put('/heroes/:slug', (req, res) => {
    HeroesModel.findOneAndReplace({
        slug: req.params.slug
    }, req.body, { new: true }).exec()
        .then((hero) => res.json(hero))
        .catch(() => res.status(500).send('An error occured'))
})

app.listen(3000, () => {
    console.log('The server is now listening on http://localhost:3000')
})