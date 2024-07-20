import express from 'express'

import { getAllUsers, updateUser, deleteUser} from '../controllers/users'
import { isAuthenticated, isOwner } from '../middlewares'

export default (router: express.Router) => {
    router.get('/users', isAuthenticated, getAllUsers)
    router.patch('/users/:id', isAuthenticated, isOwner, updateUser)
    router.delete('/users/:id', isAuthenticated, isOwner, deleteUser)
}