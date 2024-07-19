import express from 'express'

import {register, login, regenerateApiSecret} from '../controllers/authentication'

export default (router: express.Router) => {
    router.post('/auth/register', register)
    router.post('/auth/login', login)
    router.patch('/auth/regenerate', regenerateApiSecret)
}
