const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require("./utils/geocode")
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req,res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Matt'
    })
})

app.get('/about', (req,res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Robot Matt'
    })
})

app.get('/help', (req,res) => {
    res.render('help', {
        message: 'You should probably connect to the internet dipshit',
        title : 'Help',
        name: 'Matt'
    })
})

app.get('/weather', (req,res) => {

    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    }

    const address = req.query.address

    geocode(address, (error, {place_name, region, country, latitude, longitude} = {}) => {
        if (error) {
            return res.send({error})
        }
        
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({error})
            }
            res.send({
                location: place_name,
                location_region: region,
                location_country: country,
                forecast: forecastData
            })
        })
    })
})

app.get('/products', (req,res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }

    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req,res) => {
    res.render('404', {
        message: 'Help article not found',
        title: '404',
        name: 'Matt'
    })
})

app.get('*', (req,res) => {
    res.render('404', {
        title: '404',
        message: 'Page not found',
        name: 'Matt'
    })
}) 

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

