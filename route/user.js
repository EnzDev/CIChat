
var utils = require('../utils')
var User = require('../model/User')

var { red: r, green: g, blue: b } = utils


module.exports = function (router, passport) {
    router.route('/user')
        .get(function(req, res){
            User.find({}).
            select('username').
            exec(function (err, docs) {
                if (err) return res.status(409).json(
                    { status: utils.fail('Error while retrieving') }
                ) // Failed because the suername is already present
                res.json({ status: utils.success(''), users:docs})
            });
        })

    router.route('/user/register')
        .post(function (req, res) { // Create a new account
            var userData = {
                username : req.body.user,
                password : utils.hashAndDigest(req.body.password),
                token : '',
                expiration : 0
            }

            var newUser = new User(userData)

            utils.genToken(newUser) // generate first token

            newUser.save(function (err) { // Try to save the new user
                if (err) return res.status(409).json({ status: utils.fail('Username already registered') }) // Failed because the suername is already present
                console.warn(`I MongoDB: Created a new user ${b(req.body.user)}`)
                res.json({ status: utils.success('Account have been created'), token: newUser.token })
            })
        })
    
    router.route('/user/login')
        .post(function (req, res) { // Request a new token
            passport.authenticate('local', function (err, user) {
                if (err || !user) return res.json({ status: utils.fail('Invalid password/username') })

                return res.json({ status: utils.success('Logged in'), token: user.token })
            })(req, res);
        })

    return router
}