import express from "express"

import {
  getAnimalsList,
  fetchAnimalById,
  fetchAnimalByFilter,
  updateAnimal,
  insertAnimal,
} from "../controllers/animals"
import { isAuthenticated, isAdmin } from "../middlewares"

export default (router: express.Router) => {
  /**
   * @swagger
   * /animals-list:
   *   get:
   *     summary: Retrieve a list of animals
   *     tags: [Animals]
   *     responses:
   *       200:
   *         description: A list of animals
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   _id:
   *                     type: string
   *                   common_name:
   *                     type: string
   *                   img_url:
   *                     type: string
   *                   description:
   *                     type: string
   *                   kingdom:
   *                     type: string
   *                   phylum:
   *                     type: string
   *                   subphylum:
   *                     type: string
   *                   class:
   *                     type: string
   *                   infraclass:
   *                     type: string
   *                   order:
   *                     type: string
   *                   suborder:
   *                     type: string
   *                   infraorder:
   *                     type: string
   *                   superorder:
   *                     type: string
   *                   family:
   *                     type: string
   *                   subfamily:
   *                     type: string
   *                   superfamily:
   *                     type: string
   *                   genus:
   *                     type: string
   *                   subgenus:
   *                     type: string
   *                   species:
   *                     type: string
   *                   subspecies_of:
   *                     type: string
   */
  router.get("/animals-list", isAuthenticated, getAnimalsList)

  /**
   * @swagger
   * /animals/{id}:
   *   get:
   *     summary: Retrieve a specific animal
   *     tags: [Animals]
   *     responses:
   *       200:
   *         description: The requested animal
   *         content:
   *           application/json:
   *             schema:
   *                 type: object
   *                 properties:
   *                   _id:
   *                     type: string
   *                   common_name:
   *                     type: string
   *                   img_url:
   *                     type: string
   *                   description:
   *                     type: string
   *                   kingdom:
   *                     type: string
   *                   phylum:
   *                     type: string
   *                   subphylum:
   *                     type: string
   *                   class:
   *                     type: string
   *                   infraclass:
   *                     type: string
   *                   order:
   *                     type: string
   *                   suborder:
   *                     type: string
   *                   infraorder:
   *                     type: string
   *                   superorder:
   *                     type: string
   *                   family:
   *                     type: string
   *                   subfamily:
   *                     type: string
   *                   superfamily:
   *                     type: string
   *                   genus:
   *                     type: string
   *                   subgenus:
   *                     type: string
   *                   species:
   *                     type: string
   *                   subspecies_of:
   *                     type: string
   */
  router.get("/animals/:id", isAuthenticated, fetchAnimalById)

  /**
   * @swagger
   * /animals:
   *   get:
   *     summary: Retrieve animals based on filters
   *     tags: [Animals]
   *     requestBody:
   *        content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               attributes:
   *                 type: string
   *                 description: The attributes to filter by
   *     responses:
   *       200:
   *         description: A list of animals
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   _id:
   *                     type: string
   *                   common_name:
   *                     type: string
   *                   img_url:
   *                     type: string
   *                   description:
   *                     type: string
   *                   kingdom:
   *                     type: string
   *                   phylum:
   *                     type: string
   *                   subphylum:
   *                     type: string
   *                   class:
   *                     type: string
   *                   infraclass:
   *                     type: string
   *                   order:
   *                     type: string
   *                   suborder:
   *                     type: string
   *                   infraorder:
   *                     type: string
   *                   superorder:
   *                     type: string
   *                   family:
   *                     type: string
   *                   subfamily:
   *                     type: string
   *                   superfamily:
   *                     type: string
   *                   genus:
   *                     type: string
   *                   subgenus:
   *                     type: string
   *                   species:
   *                     type: string
   *                   subspecies_of:
   *                     type: string
   */
  router.get("/animals", isAuthenticated, fetchAnimalByFilter)
  router.post("/animals", isAuthenticated, isAdmin, insertAnimal)
  router.patch("/animals/:id", isAuthenticated, isAdmin, updateAnimal)
}
