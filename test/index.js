const Server = require("../index").Server;
const { GiveawaysManager } = require("discord-giveaways");
const client = new (require("discord.js")).Client();
client.giveaways = new GiveawaysManager(client, {
    storage: __dirname+"/database.json",
    updateCountdownEvery: 5000,
    default: {
        botsCanWin: false,
        exemptPermissions: [],
        embedColor: "#FF0000",
        embedColorEnd: "#7289DA",
        reaction: "🎉"
    }
});

const server = new Server(client.giveaways, {
    PORT: 3000
});

server.on("ready", () => {
    console.log(`Server started at PORT *${server.PORT}`);
});

server.createServer();

client.login("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");