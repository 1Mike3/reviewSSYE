const express = require("express")
const fs = require("fs")
const path = require("path")
const Database = require("better-sqlite3")
const UserService = require("./userService.js")
const JWTService = require("./jwtService.js")
const G = require("./globals.js")

const app = express()
const port = 5500

const dbFilePath = path.join(G.DB.DATA_FOLDER, G.DB.FILE_NAME)
const dbExists = fs.existsSync(dbFilePath)

if (!dbExists) {
    console.log("DB file not found. Creating new SQLite database...");
}

if (!fs.existsSync(G.DB.DATA_FOLDER)) {
    fs.mkdirSync(G.DB.DATA_FOLDER);
    console.log('data created!');
  } else {
    console.log('data already exists.');
  }

const db = new Database(dbFilePath)
db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
`).run()

app.use(express.json())

app.get("/", (req, res) => {
    res.send("Hello World!")
})

// TODO: Error Middleware

app.get("/auth-wellknown", (req, res) => {
    console.log("[GET] /auth-wellknown", req.body)

    res.json({
        public_key: G.JWT.publicKey.toString("utf8"),
    })
})

app.post("/login", (req, res) => {
    console.log("[POST] /login", req.body)

    const userService = new UserService(db)
    const jwtService = new JWTService()

    const username = req.body.username
    const password = req.body.password

    if (!userService.usernameExists(username)) {
        return res.status(400).json({
            error: "Username is wrong"
        })
    }

    if (!userService.usernameAndPasswordMatch(username, password)) {
        return res.status(400).json({
            error: "Password is wrong"
        })
    }

    res.json({
        jwt: jwtService.createToken(username),
    })
})

app.post("/register", (req, res) => {
    console.log("[POST] /register", req.body)

    const userService = new UserService(db)
    const jwtService = new JWTService()

    const username = req.body.username
    const password = req.body.password
    
    if (!username || !password) {
        return res.status(400).json({
            error: "Username and password are required"
        })
    }

    if (username.length < G.USER.MIN_USERNAME_LENGTH) {
        return res.status(400).json({
            error: "Username must be at least 3 chars long"
        })
    }

    if (username.length > G.USER.MAX_USERNAME_LENGTH) {
        return res.status(400).json({
            error: "Username too long. Max 100 chars"
        })
    }

    if (!G.USER.ALLOWED_USERNAME_CHARS_REGEX.test(username)) {
        return res.status(400).json({
            error: "Username has only the allowed chars: '_A-z0-9'"
        })
    }

    if (password.length < G.USER.MIN_PASSWORD_LENGTH) {
        return res.status(400).json({
            error: "Password must be at least 8 chars long"
        })
    }

    if (userService.usernameExists(username)) {
        return res.status(400).json({
            error: `Username '${username}' already exists`
        })
    }

    userService.create(username, password)

    res.json({
        jwt: jwtService.createToken(username),
    })
})

app.listen(port, () => {
    console.log(`Auth server listens on port: ${port}`)
    console.log(`USER_PASS_PEPPER=${G.USER.PASSWORD_PEPPER}`)
})