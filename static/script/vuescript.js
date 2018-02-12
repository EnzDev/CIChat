if(Vue === undefined)var Vue // useless but needed
if(Vue === undefined)var $ // useless but needed

Vue.component("message", {
    props: {
        "date": { type: Date, required: true },
        "sender": { type: String, required: true },
        "content": { type: String, required: true }
    },
    template: "#x-template-message",
    created: function () {
        console.log("Message created")
    },
    methods: {
        normalize: function (date) {
            return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        },
    }
})

var main = new Vue({
    el: "#app",
    data: {
        messages: [{ date: new Date(), sender: "Me", content: "Hi There !" }],
        users: [],
        lastMessage: 0,
        isLoggedIn: false,
        updater: undefined,
    },
    methods: {
        updateUsers: function(){
            $.get("/user", function(res){
                this.users = res.users.map((u) => u.username)
            }.bind(this))
        },
        updateMessages: function(){
            if(this.isLoggedIn){
                $.get("/messages", function(res){
                    console.log(res)
                }.bind(this))
            }
        },
        sendMessage: function(message){
            if(this.isLoggedIn){
                $.post("/messages", function(res){
                    console.log(res)
                }.bind(this))
            }
        }
    },
    created: function(){
        this.updateUsers()
        this.updateMessages()

        this.updater = setInterval(()=>this.updateMessages(), 2000)
    }
})
