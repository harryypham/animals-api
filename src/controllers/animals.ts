import express from 'express'
import { getAnimals, getAnimalById, getAnimalByFilter } from '../db/animals'

export const getAnimalsList = async (req: express.Request, res: express.Response) => {
    try {
        const sample_size = req.body.sample_size || 10
        const animals = await getAnimals(sample_size)

        return res.status(200).json(animals)
    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }
}

export const fetchAnimalById = async (req: express.Request, res: express.Response) => {
    try {
        const {id} = req.params
        const animal = await getAnimalById(id)

        return res.status(200).json(animal)
    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }
}

export const fetchAnimalByFilter = async (req: express.Request, res: express.Response) => {
    try {
        const filter = req.body
        const animals = await getAnimalByFilter(filter)

        return res.status(200).json(animals)
    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }
}