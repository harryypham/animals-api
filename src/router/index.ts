import express from 'express'
import authentication from './authentication';
import users from './users';
import animals from './animals'

const router = express.Router()

export default (): express.Router => {
    authentication(router)
    users(router)
    animals(router)

    return router;
}