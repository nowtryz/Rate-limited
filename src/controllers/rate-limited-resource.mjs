import express from 'express'
import {StatusCodes} from 'http-status-codes'
import passport from '../passport.mjs'
import redis from 'redis'

const redisClient = redis.createClient()

export default express
    .Router()
    .get('/', passport.authenticate('jwt'), (req, res) => {
    const id = req.user._id.toString()
    redisClient.get(id, (err, result) => {

        if (result !== null && result >= 10) {
            res.statusMessage = 'Enhance Your Calm'
            res.status(420).render('rate-limited.html')
        } else {
            redisClient.incr(id, (err, value) => {
                if (err) {
                    console.error(err)
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
                    return
                }

                // It is not the best algorithm but every 10 minutes, you'll be given 10 more shots
                if (value === 1) redisClient.expire(id, 10)
                res.json({
                    status: 'ok',
                    currentOccurrence: value
                })
            })
        }
    })
})
