import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit'
import mongoose from 'mongoose';

import router from './router'
require('dotenv').config({path: '.env.local'})

const app = express()
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
	limit: 100, // 100 requests per hour
    message: 'Too many requests, please try again later',
	standardHeaders: 'draft-7',
	legacyHeaders: false, 
})

app.use(cors({
    credentials: true,
}))

app.use(compression())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(limiter)

const server = http.createServer(app)

server.listen(8080, () => {
    console.log('Server is running on port http://localhost:8080')
})

const MONGO_URL = process.env.MONGO_URL

mongoose.Promise = Promise
mongoose.connect(MONGO_URL, { dbName: 'Cluster0' })
mongoose.connection.on('error', (error: Error) => console.log(error))

app.use('/', router())