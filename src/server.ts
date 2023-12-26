import { createServer } from "http";
import app from "@self/app";
import config from "@self/environment";

// create server
const server = createServer(app);

// Start the server
server.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`API server listening on port ${config.port as number}`);
});

export default server;

