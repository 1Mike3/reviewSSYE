const bcrypt = require("bcrypt")
const G = require("./globals.js")

class UserService {
    constructor(db) {
        this.db = db
    }

    usernameExists(username) {
        const rows = this.db
        .prepare("SELECT * FROM users WHERE username = ?")
        .all(username)

        return rows.length >= 1
    }

    create(username, password) {
        const hashedPassword = bcrypt.hashSync(password + G.USER.PASSWORD_PEPPER, G.USER.SALT_ROUNDS)
        this.db.prepare(`
            INSERT INTO users (username, password)
            VALUES(?, ?)
            `).run(username, hashedPassword)
    }

    usernameAndPasswordMatch(username, password) {
        const rows = this.db
        .prepare("SELECT * FROM users WHERE username = ?")
        .all(username)

        if (rows.length == 0)
            return false

        const user = rows[0]
        return bcrypt.compareSync(password + G.USER.PASSWORD_PEPPER, user.password)
    }
}

module.exports = UserService