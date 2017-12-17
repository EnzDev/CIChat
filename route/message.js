var utils = require('../utils')
var User = require('../model/Message')

var { red: r, green: g, blue: b } = utils

module.exports = function (router, passport) {
    router.route('/message/send')
        .post(function (req, res) { // Request a new token
            passport.authenticate('token', function (err, user) {
                if (err || !user) return res.json({ status: utils.fail('Invalid connexion') })

                var messageData = {
                    username : req.body.user,
                    value : req.body.message
                }
                var newMessage = new Message(messageData)
                newMessage.save(function (err) { // Try to save the new message
                    if (err) return handleError(err)
                    console.log(`I MongoDB: Created a new message from ${b(req.body.user)}`)
                    return res.json({ status: utils.success('Message saved')})
                })
                return res.json({ status: utils.success('Message send')})
            })(req, res);
        })
        .get(function (req, res){
            Message.find({}, function(err, messages) {
            res.send(messages)
            });
        })

    return router
}