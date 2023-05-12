import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import expressRateLimit from 'express-rate-limit'

// Settings
import logger from './settings/logger.settings'

dotenv.config();

const env = process.env.NODE_ENV

logger.info({
    message: `initializing application on ${env}`,
    env,
});

const app = express()

app.use(expressRateLimit({
    windowMs: 60 * 1000,
    max: 5,
    legacyHeaders: true
}))
app.use(express.json())
app.use(helmet())
app.use(cors())

const PORT = process.env.PORT || 3000

app.post('/webhook', (req, res) => {
    console.log(req)
    
    return res.sendStatus(200)
})

app.get('/healthcheck', (_, res) => {
    res.status(200).json({
        status: 'success',
        message: 'project is working',
        uptime: process.uptime()
    })
})

const server = app.listen(PORT)

export default server