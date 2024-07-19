import express from 'express'

import { getAllAnimals } from '../controllers/animals'
import { isAuthenticated } from '../middlewares'

export default (router: express.Router) => {
    router.get('/animals', isAuthenticated, getAllAnimals)
}