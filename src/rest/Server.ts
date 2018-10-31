/**
 * Created by rtholmes on 2016-06-19. Modified by sam on 2018-10-30.
 */

import fs = require("fs");
import restify = require("restify");

/**
 * This configures the REST endpoints for the server.
 */
interface Address {
    id: number;
    address: string;
}

export default class Server {

    private port: number;
    private rest: restify.Server;

    private addresses: {[key: number]: Address};

    constructor(port: number) {
        this.port = port;
        this.addresses = {};
    }

    /**
     * Stops the server. Again returns a promise so we know when the connections have
     * actually been fully closed and the port has been released.
     *
     * @returns {Promise<boolean>}
     */
    public stop(): Promise<boolean> {
        const that = this;
        return new Promise(function (fulfill) {
            that.rest.close(function () {
                fulfill(true);
            });
        });
    }

    /**
     * Starts the server. Returns a promise with a boolean value. Promises are used
     * here because starting the server takes some time and we want to know when it
     * is done (and if it worked).
     *
     * @returns {Promise<boolean>}
     */
    public start(): Promise<boolean> {
        const that = this;
        return new Promise(function (fulfill, reject) {
            try {
                that.rest = restify.createServer({
                    name: "insightUBC",
                });
                that.rest.use(restify.bodyParser({mapFiles: true, mapParams: true}));
                that.rest.use(
                    function crossOrigin(req, res, next) {
                        res.header("Access-Control-Allow-Origin", "*");
                        res.header("Access-Control-Allow-Headers", "X-Requested-With");
                        return next();
                    });

                that.rest.put("/address/:id", (req: restify.Request, res: restify.Response, next: restify.Next) => {
                    if (req.params.id in that.addresses) {
                        res.json(400, {
                            error: `Address with id = ${req.params.id} exists.`,
                            address: that.addresses[req.params.id]
                        });
                    } else {
                        let address = {
                            id: req.params.id,
                            address: req.params.body
                        };
                        that.addresses[req.params.id] = address;
                        res.send(204);
                    }
                    return next();
                });

                that.rest.del("/address/:id", (req: restify.Request, res: restify.Response, next: restify.Next) => {
                    if (req.params.id in that.addresses) {
                        delete that.addresses[req.params.id];
                        res.send(204);
                    } else {
                        res.json(404, {
                            error: `Address with id = ${req.params.id} does not exist.`
                        });
                    }
                    return next();
                });

                that.rest.post("/address/:id", (req: restify.Request, res: restify.Response, next: restify.Next) => {
                    if (req.params.id in that.addresses) {
                        that.addresses[req.params.id].address = req.params.body;
                        res.send(204);
                    } else {
                        res.json(404, {
                            error: `Address with id = ${req.params.id} does not exist.`
                        });
                    }
                    return next();
                });

                that.rest.get("/addresses", (req: restify.Request, res: restify.Response, next: restify.Next) => {
                    res.json(200, Object.values(that.addresses));
                    return next();
                });

                // This is an example endpoint that you can invoke by accessing this URL in your browser:
                // http://localhost:4321/echo/hello
                that.rest.get("/echo/:msg", Server.echo);

                that.rest.listen(that.port, function () {
                    fulfill(true);
                });

                that.rest.on("error", function (err: string) {
                    // catches errors in restify start; unusual syntax due to internal
                    // node not using normal exceptions here
                    reject(err);
                });

            } catch (err) {
                reject(err);
            }
        });
    }

    // The next two methods handle the echo service.
    // These are almost certainly not the best place to put these, but are here for your reference.
    // By updating the Server.echo function pointer above, these methods can be easily moved.
    private static echo(req: restify.Request, res: restify.Response, next: restify.Next) {
        try {
            const response = Server.performEcho(req.params.msg);
            res.json(200, {result: response});
        } catch (err) {
            res.json(400, {error: err});
        }
        return next();
    }

    private static performEcho(msg: string): string {
        if (typeof msg !== "undefined" && msg !== null) {
            return `${msg}...${msg}`;
        } else {
            return "Message not provided";
        }
    }
}
