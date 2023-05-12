import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import expressRateLimit from 'express-rate-limit'
import { exec } from 'child_process'
import { randomUUID } from 'crypto'

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
    max: 10,
    legacyHeaders: true
}))
app.use(express.json())
app.use(helmet())
app.use(cors())
app.disable('x-powered-by')

const PORT = process.env.PORT || 3000

const allowBranchs = ['main']
const path = '/Users/ramonpaolomaram/Documents/nodejs/teste'

app.post('/webhook', (req, res) => {
    const { ref, repository, sender } = req.body

    if (ref === undefined) return res.sendStatus(200)

    const { login } = sender
    const { clone_url } = repository

    const randomKey = randomUUID()

    logger.info({
        message: 'request body',
        data: {
            ref,
            login,
            clone_url,
            trace_id: randomKey,
        },
    })

    const branch = String(ref).split('/').pop()!

    if (allowBranchs.includes(branch)) {
        logger.warn({
            message: `updating code in branch '${branch}'`,
            data: {
                trace_id: randomKey,
            }
        })

        exec(`cd ${path} && git checkout ${branch} && git pull`, (error, stdout, stderr) => {
            if(error){
                logger.error({
                    message: `error exec: ${error.name}`,
                    error,
                })

                return;
            }

            logger.info({
                message: 'git pull executed with success',
                data: {
                    directory_executed: path,
                    branch,
                    trace_id: randomKey,
                    stdout,
                    stderr,
                }
            })
        })
    } else {
        logger.info({
            message: `branch '${branch}' não permitida`,
            data: {
                trace_id: randomKey,
            }
        })
    }

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