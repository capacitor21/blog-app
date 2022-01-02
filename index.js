const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const config = require('./config/config')

const session = require('express-session')
const redis = require('redis')
let RedisStore = require('connect-redis')(session)
let redisClient = redis.createClient({
    host: config.REDIS_URL,
    port: config.REDIS_PORT
})

const postRouter = require('./routes/postRoutes')
const userRouter = require('./routes/userRoutes')
const { SESSION_SECRET } = require('./config/config')

const app = express()

const dbUrl = `mongodb://${config.MONGO_USER}:${config.MONGO_PASSWORD}@${config.MONGO_IP}:${config.MONGO_PORT}/?authSource=admin`
connectWithRetry()

app.enable("trust proxy")
app.use(cors({}))
app.use(session({
    store: new RedisStore({client: redisClient}),
    secret: config.SESSION_SECRET,
    cookie: {
        secure: false,
        resave: false,
        saveUninitialized: false,
        httpOnly: true, 
        maxAge: Number(config.REDIS_MAXAGE) // Needs to be an integer
    }
}))

console.log('MAXAGE: ', config.REDIS_MAXAGE)

app.use(express.json()) //Ensures body is attached to the request object

app.get('/', (req, res) => {
    res.send("<h1>Hey!! Updated again</h1>")
})

app.use('/api/v1/posts', postRouter)
app.use('/api/v1/users', userRouter)

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}`))



// Attempt to connect to database up to 20 times with exponential backoff
function connectWithRetry (retry = 0, delay = 100) {
    mongoose.connect(dbUrl)
        .then(() => console.log('Successfully connected to the database'))
        .catch((err) => {
            console.log(`Retry: ${retry} Unexpected error connecting to db: ${err}`)

            if (retry < 20) {
                setTimeout(connectWithRetry(retry++, delay ** 2), delay)
            }
        })
}