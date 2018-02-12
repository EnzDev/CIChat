var utils = require('../utils')
var Message = require('../model/Message')

var { red: r, green: g, blue: b } = utils

module.exports = function (router, passport) {
    router.route('/message')
        .post(function (req, res) { // Request a new token
            passport.authenticate('token', function (err, user) {
                if (err || !user) return res.status(409).json({ status: utils.fail('Invalid connexion') })

                var messageData = {
                    username : user.username,
                    value : req.body.message,
                    date : new Date()
                }
                var newMessage = new Message(messageData)
                newMessage.save(function (err) { // Try to save the new message
                    if (err) return res.json({ status: utils.fail('couldnt save the message')})
                    console.warn(`I MongoDB: Created a new message from ${b(user.username)}`)
                    return res.json({ status: utils.success('Message saved')})
                })
            })(req, res);
        })
        .get(function (req, res){
            Message.find({messageId:{$gt: req.query.starting || -1}})
            .select('messageId value username date')
            .exec(function(err, messages) {
                res.json({status:utils.success(''), messages})
            });
        })

    return router
}