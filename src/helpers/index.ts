import crypto from 'crypto';

const SECRET = 'harrypham1812-secret'

export const random = () => crypto.randomBytes(128).toString('base64')
export const generateApiKey = () => crypto.randomBytes(16).toString('base64')
export const generateApiSecret = () => crypto.randomBytes(16).toString('base64')
export const authentication = (salt: string, password: string) => {
    return crypto.createHmac('sha256', [salt, password].join('/')).update(SECRET).digest('hex')
}
