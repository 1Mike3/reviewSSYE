const fs = require("fs")
const path = require("path")

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY
const JWT_PUBLIC_KEY = process.env.JWT_PUBLIC_KEY
const USER_PASS_PEPPER = process.env.USER_PASS_PEPPER

let missing_envs = []
!JWT_PRIVATE_KEY && missing_envs.push("JWT_PRIVATE_KEY")
!JWT_PUBLIC_KEY && missing_envs.push("JWT_PUBLIC_KEY")
!USER_PASS_PEPPER && missing_envs.push("USER_PASS_PEPPER")

if (missing_envs.length > 0) {
    console.error("Auth Server can't start. Missing ENVs:", missing_envs);
    process.exit(1)
}

const G = Object.freeze({
    DB: Object.freeze({
        DATA_FOLDER: "./data",
        FILE_NAME: "authservice.sqlite",
    }),
    USER: Object.freeze({
        MIN_PASSWORD_LENGTH: 8,
        MIN_USERNAME_LENGTH: 3,
        MAX_USERNAME_LENGTH: 100,
        ALLOWED_USERNAME_CHARS_REGEX: /^[_A-z0-9]+$/,
        SALT_ROUNDS: 10,
        PASSWORD_PEPPER: USER_PASS_PEPPER,
    }),
    JWT: Object.freeze({
        privateKey: fs.readFileSync(path.join(process.env.JWT_PRIVATE_KEY.trim())),
        publicKey: fs.readFileSync(path.join(process.env.JWT_PUBLIC_KEY.trim())),
    })
})

module.exports = G