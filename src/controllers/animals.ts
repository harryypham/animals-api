import express from 'express'
import { getAnimals } from '../db/animals'

export const getAllAnimals = async (req: express.Request, res: express.Response) => {
    try {
        const animals = await getAnimals(10)

        return res.status(200).json(animals)
    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }
}