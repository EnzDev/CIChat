// server.js

class LoadingError extends Error {} // Define error for tests

// Setup ExpressJS 4
// =============================================================================

// Instantiate the needed packages
var express = require('express')        // ExpressJS
var app = express()                     // Create the Express App
var bodyParser = require('body-parser')
var passport = require('passport')
var utils = require('./utils') // Import coloration
var { red: r, green: g, blue: b } = utils // Assign red/green/blue to their shortcut

// configure app to use bodyParser, this help us parse POST requests
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json()); // we will use JSON data




// Loading DataBase
// =============================================================================


// Distant DocumentDB
var autoIncrement = require('mongoose-auto-increment');
var mongoose = require('mongoose'); 

var MongoSetup = {}
 
MongoSetup.host = process.env.HOST || 'enzomallard.fr' // Try to get the host
MongoSetup.uristring = `mongodb://${MongoSetup.host}:27017/API`

MongoSetup.init = () => mongoose.connect(MongoSetup.uristring, function (err) {
    if (err) {
        console.error(`E MongoDB: Can't connect to database at ${b(MongoSetup.uristring)}.`)
        console.error(`E MongoDB: ${r(err.message)}`)
        console.error(`E Server: Could not load a component : ${g('MongoDB')}`)
        console.warn(new LoadingError(r('MongoDB loading')))
        // TODO uncomment : process.exit()
    } else {
        console.warn(`I MongoDB: Connected to ${b(MongoSetup.uristring)}`)
        MongoSetup.next();
    }
})



// Token/Login strategy
// =============================================================================
var User = require('./model/User')
var TokenStrategy = require('passport-accesstoken').Strategy
var LocalStrategy = require('passport-local').Strategy

passport.use(new TokenStrategy(
    function (token, done) {
        console.warn(`I Passport: Using ${g('token strategy')} with token ${b(token)}`)
        User.findOne({ token: token }, function (err, user) { // User seems to exist in the passport context (where used) 
            if (err) return done(err)
            if (!user || user.expiration < Date.now() || token === '') {
                console.warn(`I Passport: ${g('Token strategy')} failed for ${b(token)}`)
                if (!user) return done(null, false)
                user.token = ''
                user.save(function () {
                    return done(null, false)
                })
            } else {
                console.warn(`I Passport: Successfully login ${b(token)} with ${g('token strategy')}`)
                user.expiration = Date.now() + 1000 * 60 * 60 // revalidate for 1h
                user.save(function(){
                    return done(null, user)
                })
            }
        })
    }
))

passport.use(new LocalStrategy(
    { usernameField: 'user', passwordField: 'password' },
    function (username, password, done) {
        console.warn(`I Passport: Using ${g('password strategy')} for user ${b(username)}`)
        User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user || user.password !== utils.hashAndDigest(password)) {
                console.warn(`I Passport: Cannot login user ${b(username)} with ${g('password strategy')}`)
                return done(null, false)
            }

            console.warn(`I Passport: Successfully login ${b(username)}, updating token...`)
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
    console.warn(`I ExpressJS: Request from ${r(req.ip)} to ${g(req.originalUrl)} with ${b(req.method)}`)
    res.setHeader('X-Powered-By', 'Isaak et Enzo - Nantes')
    next()
})

app.use(passport.initialize())
app.use(passport.session())

/* router.get('/', function (req, res) {
    res.send('Bonjour')
}) */


MongoSetup.next = ()=>{}
autoIncrement.initialize(MongoSetup.init())

// Include the four routers
// Routes

router = require('./route/user')(router, passport)
router = require('./route/message')(router, passport)

app.use('/', router) // Allow all url from /api to be routed with the router
app.use(express.static(require('path').join(__dirname, 'static')))

// Start the server only when DocumentDB, MongoDB and Geth are ready
// =============================================================================
module.exports = app