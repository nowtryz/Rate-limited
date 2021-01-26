import 'express-async-errors' // wait for promises before responding, so users can receive error messages
import express from 'express'
import bodyParser from 'body-parser'
import {StatusCodes} from 'http-status-codes'
import consolidate from 'consolidate'
import UserController from './controllers/user.mjs'
import AuthenticationController from './controllers/authentication.mjs'
import RateLimitedResourceController from './controllers/rate-limited-resource.mjs'
import {initDatabase} from './database.mjs'
import passport from './passport.mjs'

const app = express()
const port = 3000

app.use(bodyParser.json()) // parse body
app.use(passport.initialize()) // use Jwt authentification
app.engine('html', consolidate.swig)
app.set('view engine', 'html') // view engine
app.use('/users', UserController) // User crud
app.use('/', AuthenticationController) // Authentication
app.use('/', RateLimitedResourceController) // Rate limited access

// Catch async errors
app.use(async (error, req, res, next) => {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        ...error,
        message: error.message
    })
    console.error(error)
})

// Resource not found
app.use((req, res) => {
    res.status(StatusCodes.NOT_FOUND).json({
        message: 'Resource not found on this server'
    })
})

// should not fail, no need to catch errors
initDatabase().then(() => app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
}))

