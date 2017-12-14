// server.js

// Setup ExpressJS 4
// =============================================================================

// Instantiate the needed packages
var express = require('express')        // ExpressJS
var app = express()                     // Create the Express App
var bodyParser = require('body-parser')
var passport = require('passport')
var { red: r, green: g, blue: b } = require("./utils") // Import coloration


// configure app to use bodyParser, this help us parse POST requests
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json()); // we will use JSON data

var port =  process.env.PORT || 80  // Set the default port if no args and $env:PORT is not defined


// Loading DataBase
// =============================================================================


// Distant DocumentDB

MongoSetup = {}
 
MongoSetup.uristring = 'mongodb://localhost:27017/API'
 
MongoSetup.init = () => mongoose.connect(MongoSetup.uristring, function (err) {
    if (err) {
        console.log(`E MongoDB: Can't connect to database at ${b(MongoSetup.uristring)}.`)
        console.log(`E MongoDB: ${r(err.message)}`)
        console.log(`E Server: Could not load a component : ${g("MongoDB")}`)
        process.exit()
    } else {
        console.log(`I MongoDB: Connected to ${b(MongoSetup.uristring)}`)
        MongoSetup.next();
    }
})


// Token/Login strategy
// =============================================================================
var TokenStrategy = require('passport-accesstoken').Strategy
var LocalStrategy = require('passport-local').Strategy

passport.use(new TokenStrategy(
    function (token, done) {
        console.log(`I Passport: Using ${g("token strategy")} with token ${b(token)}`)
        User.findOne({ token: token }, function (err, user) { // User seems to exist in the passport context (where used) 
            if (err) return done(err)
            if (!user || user.expiryToken < Date.now() || token === "") {
                console.log(`I Passport: ${g("Token strategy")} failed for ${b(token)}`)
                if (!user) return done(null, false)
                user.token = ""
                user.save(function () {
                    return done(null, false)
                })
            } else {
                console.log(`I Passport: Successfully login ${b(token)} with ${g("token strategy")}`)
                return done(null, user)
            }
        })
    }
))

passport.use(new LocalStrategy(
    { usernameField: 'user', passwordField: 'password' },
    function (username, password, done) {
        console.log(`I Passport: Using ${g("password strategy")} for user ${b(username)}`)
        User.findOne({ user: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user || user.password !== utils.hashAndDigest(password)) {
                console.log(`I Passport: Cannot login user ${b(username)} with ${g("password strategy")}`)
                return done(null, false)
            }

            console.log(`I Passport: Successfully login ${b(username)}, updating token...`)
            utils.genToken(user) // Update the user token with a valid one and make it valid for 1 hour
            user.save(function () {
                return done(null, user)
            })
        })
    }
))

passport.serializeUser(function (user, done) {
    done(null, user)
})

passport.deserializeUser(function (user, done) {
    done(null, user)
})

// Routes for the API
// =============================================================================
var router = express.Router()       // get an instance of the express Router

router.use(function (req, res, next) {
    console.log(`I ExpressJS: Request from ${r(req.ip)} to ${g(req.originalUrl)} with ${b(req.method)}`)
    res.setHeader("X-Powered-By", "Isaak et Enzo - Nantes")
    next()
})

app.use(passport.initialize())
app.use(passport.session())

router.get('/', function (req, res) {
    res.send("Bonjour")
})

// Include the four routers
// Routes

app.use('/api/', router) // Allow all url from /api to be routed with the router


// Start the server only when DocumentDB, MongoDB and Geth are ready
// =============================================================================
MongoSetup.next = () => app.listen(port, () => console.log(`I Server: Listening on port ${r(port)}`))
MongoSetup.init();
