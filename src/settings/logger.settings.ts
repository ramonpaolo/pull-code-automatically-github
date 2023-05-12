import winston from 'winston';
import { hostname } from 'os';

const serviceName = 'pull-code-automatically'

// Enable send logs to DataDog
const httpOptions: winston.transports.HttpTransportOptions = {
    host: 'http-intake.logs.datadoghq.com',
    path: `/api/v2/logs?dd-api-key=${process.env.DATADOG_API_KEY}&ddsource=nodejs&service=${serviceName}-${process.env.NODE_ENV}&hostname=${hostname()}`,
    ssl: true
}

const logger = winston.createLogger({
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [
        new winston.transports.Console(),
        new winston.transports.Http(httpOptions),
    ]
})

export default logger