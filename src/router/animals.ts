import express from 'express'

import { getAnimalsList, fetchAnimalById, fetchAnimalByFilter } from '../controllers/animals'
import { isAuthenticated } from '../middlewares'

export default (router: express.Router) => {
    router.get('/animals-list', isAuthenticated, getAnimalsList)
    router.get('/animals/:id', isAuthenticated, fetchAnimalById)
    router.get('/animals', isAuthenticated, fetchAnimalByFilter)
}