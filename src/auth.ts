import { Request, Response } from 'express'
import config from '@self/environment'
import logger from '@self/logging/logger'

// API key authentication
const auth = (req: Request, res: Response) => {
    /*
    const authHeader = req.get("Authorization");
    let authOK = false;
    if (authHeader){
        const authHeaderList = authHeader.split(" ");
        if ( authHeaderList.length == 2 && authHeaderList[0] === "Bearer" ) 
        {
            const token = authHeaderList[1];
            if ( token && token === config.auth_token ) { authOK = true; } 
            else { console.log(`Wrong token: '${token}'`); }
        } 
        else { console.log(`Not a bearer token: '${authHeaderList}'`); }
    } else { console.log("No Authorization header"); }
    */

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
