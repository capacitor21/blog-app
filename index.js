const express = require('express')
const mongoose = require('mongoose')

const app = express()
const port = process.env.PORT || 3000

mongoose.connect('mongodb://root:docker123@db/?authSource=admin')
    .then(() => console.log('Successfully connected to the database'))
    .catch((err) => console.log(`Unexpected error connecting to db: ${err}`))

app.get('/', (req, res) => {
    res.send("<h1>Hey!! Updated again</h1>")
})

app.listen(port, () => console.log(`Listening on port ${port}`))