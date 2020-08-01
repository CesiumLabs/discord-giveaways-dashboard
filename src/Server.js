const { EventEmitter } = require("events");
const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const { error } = require("console");

const defaultOptions = {
    PORT: process.env.PORT || 3000,
    SESSION_SECRET: "ghqtoierhngiorqehngikqremjogvQREQGQEROHJREOHJQROPEJGO582416841",
    USERNAME: "root",
    PASSWORD: "root"
};

class Server extends EventEmitter {

    /**
     * Creates a server
     * @param GiveawaysManager GiveawaysManager class from discord-giveaways
     * @param {object} options Server options.
     * @param {number} [options.PORT] PORT for the server.
     * @param {string} [options.SESSION_SECRET] Session secret.
     * @param {string} [options.USERNAME] Username (required to login)
     * @param {string} [options.PASSWORD] Password (required to login)
     */
    constructor(GiveawaysManager, options=defaultOptions) {
        if (!GiveawaysManager || !GiveawaysManager.client) throw new Error("GiveawaysManager not found!");
        super();

        /**
         * Giveaways Manager
         */
        this.manager = GiveawaysManager;
        /**
         * Discord Client
         */
        this.client = this.manager.client;
        /**
         * PORT
         */
        this.PORT = options.PORT && !isNaN(options.PORT) ? options.PORT : defaultOptions.PORT;
        /**
         * Session Secret
         */
        this.SESSION_SECRET = options.SESSION_SECRET && typeof options.SESSION_SECRET === "string" ? options.SESSION_SECRET : defaultOptions.SESSION_SECRET;
        /**
         * Username
         */
        this.USERNAME = options.USERNAME && typeof options.USERNAME === "string" ? options.USERNAME : defaultOptions.USERNAME;
        /**
         * Password
         */
        this.PASSWORD = options.PASSWORD && typeof options.PASSWORD === "string" ? options.PASSWORD : defaultOptions.PASSWORD;
    }

    /**
     * Creates HTTP server.
     */
    createServer() {
        /**
         * HTTP Server
         */
        this.app = express();

        this.app.set("view engine", "ejs");
        this.app.use(express.static(__dirname+"/../public"));
        this.app.set("views", __dirname +"/../views");
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(session({
            saveUninitialized: false,
            secret: this.SESSION_SECRET,
            resave: false
        }));
        this.app.use(helmet());

        this.app.use("/", require("./Routes/main")(this));
        this.app.all("*", (req, res) => {
            return res.render("error", {
                title: "404",
                error: "Not Found!",
                code: 404,
                user: req.session.user || null
            });
        });

        this.app.use((err, req, res) => {
            return res.render("error", {
                title: "404",
                error: err,
                code: err.statusCode || 500,
                user: req.session.user || null
            });
        });

        this.app.listen(this.PORT, () => {
            /**
             * Timestamp when server became ready
             * @type {Date}
             */
            this.readyAt = new Date();

            this.emit("ready", { PORT: this.PORT, server: this.app });
        });
        return true;
    }

}

module.exports = Server;