// Import modules
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const path = require('path')
const mongoose = require('mongoose')

const connectDB = require('./config/connectDB')
const rootRoute = require('./routes/rootRoute')
const userRoute = require('./routes/userRoute')
const mediaRoute = require('./routes/mediaRoute')
const personRoute = require('./routes/personRoute')
const reviewRoute = require('./routes/reviewRoute')

// App instance
const app = express()

// Middlewares and public path
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// Connect database
connectDB()

// Set up routes
app.use('/', rootRoute)
app.use('/user', userRoute)
app.use('/person', personRoute)
app.use('/reviews', reviewRoute)
app.use('/:mediaType', mediaRoute)

// Handle 404 page
app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: 'Page Not Found' })
    } else {
        res.type('txt').send('Page Not Found')
    }
})

// Port and listener
const PORT = process.env.PORT || 5000
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
})
mongoose.connection.on('error', (err) => {
    console.log(err)
})
