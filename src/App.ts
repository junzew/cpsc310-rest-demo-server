/**
 * Created by rtholmes on 2016-06-19.
 */
import Server from "./rest/Server";

/**
 * Main app class that is run with the node command. Starts the server.
 */
export class App {
    public async initServer(port: number) {
        return this.startServer(port);
    }

    private startServer(port: number) {
        const server = new Server(port);
        return server.start();
    }
}

// This ends up starting the whole system and listens on a hardcoded port (11315)
(async () => {
    const app = new App();
    await app.initServer(11315);
})();
