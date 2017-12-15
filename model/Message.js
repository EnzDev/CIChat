var mongoose = require("mongoose")

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
module.export = mongoose.model("Message" , MessageSchema)
