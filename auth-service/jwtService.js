const jwt = require("jsonwebtoken")
const G = require("./globals.js")

class JWTService {
    createToken(username) {
        const now = Math.floor(Date.now() / 1000)

        return jwt.sign({
            sub: username,
            exp: now + 24 * 60 * 60,
            iss: "http://localhost:5500",
            aud: "http://localhost:5501",
            iat: now,
            jti: crypto.randomUUID(),
        }, G.JWT.privateKey, { algorithm: "RS256" })
    }
}

module.exports = JWTService