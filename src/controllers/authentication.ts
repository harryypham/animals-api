import express from "express"
import { createUser, getUserByApiKey, getUserByEmail } from "../db/users"
import { authentication, generateApiKey, random } from "../helpers"

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(401).send({
        message: "Missing credentials",
      })
    }

    const existingUser = await getUserByEmail(email)

    if (existingUser) {
      return res.status(403).send({
        message: "User already exists",
      })
    }

    const salt = random()
    const api_key = generateApiKey()
    const api_secret = generateApiKey()
    const user = await createUser({
      email,
      api_key,
      admin: false,
      authentication: {
        salt,
        password: authentication(salt, password),
        api_secret: authentication(salt, api_secret),
      },
    })
    const responseUser = {
      ...user,
      api_secret,
    }

    return res.status(200).json(responseUser).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(400)
  }
}

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { api_key, api_secret } = req.body

    if (!api_key || !api_secret) {
      return res.status(401).send({
        message: "Missing credentials",
      })
    }

    const user = await getUserByApiKey(api_key).select(
      "+authentication.salt +authentication.api_secret"
    )

    if (!user) {
      return res.sendStatus(401)
    }

    const expectedHash = authentication(user.authentication.salt, api_secret)
    if (user.authentication.api_secret !== expectedHash) {
      return res.sendStatus(401)
    }

    const salt = random()

    user.authentication.sessionToken = authentication(salt, user._id.toString())

    await user.save()

    res.cookie("HARRY_AUTH", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    })

    return res.status(200).json(user).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(400)
  }
}

export const regenerateApiSecret = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.sendStatus(400)
    }

    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    )

    if (!user) {
      return res.sendStatus(401)
    }

    const expectedHash = authentication(user.authentication.salt, password)
    if (user.authentication.password !== expectedHash) {
      return res.sendStatus(401)
    }

    const salt = random()
    const api_key = generateApiKey()
    const api_secret = generateApiKey()
    const hashed_api_secret = authentication(
      user.authentication.salt,
      api_secret
    )

    user.api_key = api_key
    user.authentication.api_secret = hashed_api_secret
    user.authentication.sessionToken = authentication(salt, user._id.toString())

    await user.save()

    res.cookie("HARRY_AUTH", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    })

    const responseUser = {
      ...user.toObject(),
      api_secret,
    }
    console.log(responseUser)
    delete responseUser.authentication

    return res.status(200).json(responseUser).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(400)
  }
}
