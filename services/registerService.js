let DBConnection = require("./../config/db");
let bcrypt = require("bcryptjs");

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        // check email is exist or not
        let isUsernameExist = await checkExistUsername(data.username);
        if (isUsernameExist) {
            reject(`This username "${data.username}" has already exist. Please choose an other`);
        } else {
            // hash password
            let salt = bcrypt.genSaltSync(10);
            let userItem = {
                name: data.name,
                username: data.username,
                email: data.email,
                password: bcrypt.hashSync(data.password, salt),
                admin: 1,
                process: 0,
                direction: 0,
                manager: 0,
                superOperator: 0,
                factory: "Visitor"
            };

            //create a new account
            DBConnection.query(
                ' INSERT INTO sys_users set ? ', userItem,
                function(err, rows) {
                    if (err) {
                        reject(false)
                    }
                    resolve("Create a new user successful");
                }
            );
        }
    });
};

let checkExistEmail = (email) => {
    return new Promise( (resolve, reject) => {
        try {
            DBConnection.query(
                ' SELECT * FROM `sys_users` WHERE `email` = ?  ', email,
                function(err, rows) {
                    if (err) {
                        reject(err)
                    }
                    if (rows.length > 0) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};
let checkExistUsername = (username) => {
    return new Promise( (resolve, reject) => {
        try {
            DBConnection.query(
                ' SELECT * FROM `sys_users` WHERE `username` = ?  ', username,
                function(err, rows) {
                    if (err) {
                        reject(err)
                    }
                    if (rows.length > 0) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = {
    createNewUser: createNewUser
};
