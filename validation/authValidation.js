const { check } = require('express-validator');

let validateRegister = [
    check("name", "Name is required!").not().isEmpty(),
    check("email", "Email is required!").isEmail(),
    check("password","Please enter a password at least 5 character and contain At least one uppercase.At least one lower case.At least one special character. ",).isLength({ min: 5 }).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/,),
    check("username", "username is required!").not().isEmpty(),
    check("passwordConfirmation", "Password confirmation does not match password").custom((value, { req }) => {
            return value === req.body.password
        })
    ];

let validateLogin = [
    check("email", "Invalid email").isEmail().trim(),
    check("password", "Invalid password").not().isEmpty()
];

module.exports = {
    validateRegister: validateRegister,
    validateLogin: validateLogin
};
