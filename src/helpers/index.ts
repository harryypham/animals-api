import crypto from 'crypto';
require('dotenv').config({path: '.env.local'})

const SECRET_KEY = process.env.SECRET_KEY
export const random = () => crypto.randomBytes(128).toString('base64')
export const generateApiKey = () => crypto.randomBytes(18).toString('base64')
export const authentication = (salt: string, password: string) => {
    return crypto.createHmac('sha256', [salt, password].join('/')).update(SECRET_KEY).digest('hex')
}
