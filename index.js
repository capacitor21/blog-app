const express = require('express')
const mongoose = require('mongoose')
const dbConfig = require('./config/config')

const app = express()
const port = process.env.PORT || 3000


const dbUrl = `mongodb://${dbConfig.MONGO_USER}:${dbConfig.MONGO_PASSWORD}@${dbConfig.MONGO_IP}:${dbConfig.MONGO_PORT}/?authSource=admin`

// Attempt to connect to database up to 20 times with exponential backoff
const connectWithRetry = (retry = 0, delay = 100) => {
    mongoose.connect(dbUrl)
        .then(() => console.log('Successfully connected to the database'))
        .catch((err) => {
            console.log(`Retry: ${retry} Unexpected error connecting to db: ${err}`)

            if (retry < 20) setTimeout(connectWithRetry(retry++, delay ** 2), delay)
        })
}

connectWithRetry()



app.get('/', (req, res) => {
    res.send("<h1>Hey!! Updated again</h1>")
})

app.listen(port, () => console.log(`Listening on port ${port}`))