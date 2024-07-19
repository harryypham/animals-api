import express from 'express'

import { getAnimalsList, fetchAnimalById, fetchAnimalByFilter, updateAnimal, insertAnimal } from '../controllers/animals'
import { isAuthenticated, isAdmin } from '../middlewares'

export default (router: express.Router) => {
    router.get('/animals-list', isAuthenticated, getAnimalsList)
    router.get('/animals/:id', isAuthenticated, fetchAnimalById)
    router.get('/animals', isAuthenticated, fetchAnimalByFilter)
    router.post('/animals', isAuthenticated, isAdmin, insertAnimal)
    router.patch('/animals/:id', isAuthenticated, isAdmin, updateAnimal)
}