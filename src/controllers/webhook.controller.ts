import { Request, Response } from 'express'
import { exec } from 'child_process'
import { randomUUID } from 'crypto'

// Settings
import logger from '../settings/logger.settings'

const allowBranchs = ['main'] // Example: 'main', 'master', 'test'
const path = '<path-project>' // Example: /home/foo/documents/nodejs/project

const webhook = (req: Request, res: Response) => {
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
}

export default webhook