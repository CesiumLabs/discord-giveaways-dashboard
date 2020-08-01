const app = require("express").Router()

module.exports = (Manager) => {

    app.get("/", (req, res) => {
        if (req.session.user) return res.redirect("/dashboard");
        return res.render("index", {
            title: "Discord Giveaways - Login",
            error: null,
            user: req.session.user || null
        });
    });

    app.post("/", (req, res) => {
        if (req.session.user) return res.redirect("/dashboard");

        const userNameMatch = req.body.username === Manager.USERNAME;
        const passwordMatch = req.body.password === Manager.PASSWORD;

        if (!!userNameMatch && !!passwordMatch) {
            req.session.user = true;
            return res.redirect("/dashboard");
        };

        return res.render("index", {
            error: "Invalid Username or Password!",
            title: "Discord Giveaways - Login",
            user: req.session.user || null
        });
    });

    app.get("/login", (req, res) => {
        return res.redirect("/");
    });

    app.get("/logout", (req, res) => {
        if (!req.session.user) return res.redirect("/");
        req.session.destroy();
        return res.redirect("/");
    });

    app.get("/dashboard", async (req, res) => {
        if (!req.session.user) return res.redirect("/");

        return res.render("dashboard", {
            title: "Discord Giveaways - Dashboard",
            manager: Manager.manager,
            bot: Manager.client,
            user: req.session.user || null
        });
    });

    return app;
};