import express from "express"
import {StatusCodes} from "http-status-codes"
import jwt from "jsonwebtoken"
import User from './user.mjs'
import {JWT_SECRET} from '../config.mjs'

const createToken = (id, email) => jwt.sign(
    {id, username: email},
    JWT_SECRET,
    // No options, the project is too simple to bother with audience and issuer
    // Best practice goes brrr :)
)


export default express.Router().post('/login', async (req, res) => {
    if (!req.body.email) res.status(StatusCodes.BAD_REQUEST).json({message: 'email is missing'})
    else if(!req.body.password) res.status(StatusCodes.BAD_REQUEST).json({message: 'password is missing'})
    else{
        const user = await User.findOne({email:req.body.email}).select('+password')

        if (!user || !await user.comparePassword(req.body.password)) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                message: 'email or password is incorrect'
            })
        }

        else {
            res.status(StatusCodes.OK).json({
                token: createToken(user._id, user.email),
                user: {
                    ...user.toObject(),
                    password: undefined, // Don't forget to strip password
                },
            })
        }

    }
})
