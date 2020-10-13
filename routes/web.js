var express = require('express');
let usersControllers = require('../controllers/userController');
let auth = require("../validation/authValidation");

let passport = require("passport");
let initPassportLocal = require("../controllers/passportLocalController");

// Init all passport
initPassportLocal();


let router = express.Router();
let initWebRoutes = (app) => {
    // GET Pages index
    router.get('/', usersControllers.getIndex);

    //GET POST Login
    router.get("/login",usersControllers.checkLoggedOut, usersControllers.getLogin);
    router.post("/login", passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        successFlash: true,
        failureFlash: true
    }));

    //GET POST register
    router.get('/register', usersControllers.getRegister);
    router.post('/register', auth.validateRegister, usersControllers.postRegister);

    router.get("/logout", usersControllers.getLogOut);

    return app.use("/", router);
};
module.exports = initWebRoutes;