import { createServer } from 'http'
import app from '@self/app'
import config from '@self/environment'
import logger from '@self/logging/logger'

// create server
const server = createServer(app)

// Start the server
server.listen(config.port, () => {
    // eslint-disable-next-line no-console
    logger.info(`API server listening on port ${config.port as number}`)
})

export default server
