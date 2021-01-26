import express from "express";
import User from "./user.mjs";
import {StatusCodes} from "http-status-codes";


const router = express.Router()

router.post('/', async (req,res) => {
    const user = new User(req.body)
    await user.save()

    res.json({
        ...user.toJSON(),
        password: undefined, // Strip password from response
    })
})

router.get('/', async (req, res) => {
    const users = await User.find()
    res.json(users)
})

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id)

    if (user !== undefined) res.json(user)
    else res.status(StatusCodes.NOT_FOUND).json({
        message: `User with id ${req.params.id} on this server`
    })
})

export default router
