let {validationResult } = require('express-validator');

let registerService = require("./../services/registerService");
let loginService = require("../services/loginService");


let getIndex = (req, res, next) => {
           let User = req.user;
           res.render( 'index', {
                title: "Index Page",
                user: User
           });
    };
let getRegister = (req, res) => {
    let User = req.user;
    return res.render("register", {
        title: "Register Page",
        user: req.user,
        errors: req.flash("errors")
    });
};
let postRegister = async (req, res) => {
    //validate required fields
    let errorsArr = [];
    let validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        let errors = Object.values(validationErrors.mapped());
        errors.forEach((item) => {
            errorsArr.push(item.msg);
        });
        req.flash("errors", errorsArr);
        return res.redirect("/register");
    }

    //create a new user
    let newUser = {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    };
    try {
        await registerService.createNewUser(newUser);
        return res.redirect("/login");
    } catch (err) {
        req.flash("errors", err);
        return res.redirect("/register");
    }
};


let getLogin = (req, res) => {
    let User = req.user;
    return res.render("login.ejs", {
        title: "Login Page",
        user: User,
        errors: req.flash("errors")
    });
};
let handleLogin = async (req, res) => {
    let errorsArr = [];
    let validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        let errors = Object.values(validationErrors.mapped());
        errors.forEach((item) => {
            errorsArr.push(item.msg);
        });
        req.flash("errors", errorsArr);
        return res.redirect("/login");
    }

    try {
        await loginService.handleLogin(req.body.username, req.body.password);
        return res.redirect("/");
    } catch (err) {
        req.flash("errors", err);
        return res.redirect("/login");
    }
};
let checkLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/login");
    }
    next();
};
let checkLoggedOut = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    next();
};

let getLogOut = (req, res) => {
    req.session.destroy(function(err) {
        return res.redirect("/login");
    });
};

module.exports = {
    getIndex: getIndex,
    getRegister: getRegister,
    postRegister:postRegister,
    getLogOut: getLogOut,

    getLogin:getLogin,
    handleLogin: handleLogin,
    checkLoggedIn: checkLoggedIn,
    checkLoggedOut: checkLoggedOut,

};


