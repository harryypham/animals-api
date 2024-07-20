import express from "express"
import { getAnimals, getAnimalById, getAnimalByFilter, updateAnimalById, createAnimal } from "../db/animals"

export const getAnimalsList = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const sample_size = req.body.sample_size || 10
    const animals = await getAnimals(sample_size)

    return res.status(200).json(animals)
  } catch (error) {
    console.log(error)
    return res.sendStatus(400)
  }
}

export const fetchAnimalById = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params
    const animal = await getAnimalById(id)

    return res.status(200).json(animal)
  } catch (error) {
    console.log(error)
    return res.sendStatus(400)
  }
}

export const fetchAnimalByFilter = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const filter = req.body
    const animals = await getAnimalByFilter(filter)

    return res.status(200).json(animals)
  } catch (error) {
    console.log(error)
    return res.sendStatus(400)
  }
}

export const insertAnimal = async (req: express.Request, res: express.Response) => {
    try {
        const {common_name, img_url, description} = req.body
        if (!common_name || !img_url || !description) {
            return res.status(400).send({message: 'Animal is not valid'})
        }
        const animal = await createAnimal(req.body)
    
        return res.status(200).json(animal)
    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }
}

export const updateAnimal = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params
    const animal = await updateAnimalById(id, req.body)

    return res.status(200).json(animal)
  } catch (error) {
    console.log(error)
    return res.sendStatus(400)
  }
}
