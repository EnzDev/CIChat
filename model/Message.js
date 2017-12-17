var mongoose = require('mongoose')
var autoIncrement = require('mongoose-auto-increment');

var MessageSchema = new mongoose.Schema({
  username : String,
  value : String
})
MessageSchema.plugin(autoIncrement.plugin, {
    model: 'Message',
    field: 'messageId',
    startAt: 0,
    incrementBy: 1
});
module.exports = mongoose.model('Message' , MessageSchema)
