import express from 'express'
import { get, merge } from 'lodash'

import { getUserBySessionToken, getUserByEmail, getUserByApiKey } from '../db/users'
import { authentication } from '../helpers'

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const sessionToken = req.cookies['HARRY_AUTH']
        let existingUser

        if (!sessionToken) {
            const { api_key, api_secret } = req.body;

            if (!api_key || !api_secret) {
                
                return res.sendStatus(400);
            }

            const user = await getUserByApiKey(api_secret).select('+authentication.salt +authentication.api_secret');

            if (!user) {
                return res.sendStatus(400);
            }

            const expectedHash = authentication(user.authentication.salt, api_secret);
            if (user.authentication.api_secret !== expectedHash) {
                return res.sendStatus(403);
            }
            delete user.authentication.salt;
            delete user.authentication.api_secret;
            existingUser = user;
        } else {
            existingUser = await getUserBySessionToken(sessionToken)
        }

        if (!existingUser) {
            return res.sendStatus(403)
        }

        merge(req, {identity: existingUser})

        return next()

    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }
}

export const isOwner = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const {id} = req.params
        const currentUserId = get(req, 'identity._id') as string 

        if (!currentUserId) {
            return res.sendStatus(403)
        }

        if (currentUserId.toString() !== id) {
            return res.sendStatus(403)
        }

        next()
    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }
}
