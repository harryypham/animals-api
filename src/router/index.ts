import express from 'express'

import authentication from './authentication';
import users from './users';
import animals from './animals'
import apiDocs from './api-docs'


const router = express.Router()

export default (): express.Router => {
    apiDocs(router)
    authentication(router)
    users(router)
    animals(router)

    return router;
}