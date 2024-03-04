import { Request, Response } from 'express'
import config from '@self/environment'
import logger from '@self/logging/logger'

// API key authentication
const auth = (req: Request, res: Response) => {
    let authOK = false
    const token = req.get('X-API-KEY')
    if (token && token === config.auth_token) {
        authOK = true
    }

    if (authOK) {
        logger.debug('authOK')
    } else {
        logger.debug(`Wrong token: '${token}'`)
        res.status(401).json({
            message: '',
            errors: 'Wrong authentication token',
        })
    }

    return authOK
}

export default auth
