if (!$) var $

// All methods are error first promises

class App {
    constructor() {
        this.user = undefined // Token/Username

        this.serveUrl = window.location.origin

        this.users = [] // Logged users

        this.lastId = 0

        this.updateUsers()

        this.messages = []
        this.messages[0] = {
            from: "Enzouille", // Sender
            date: new Date("11/11/1111"), // Received date
            content: "Message"
        } // Just a sample
    }

    login(user, password) {
        var app = this
        return new Promise((res, rej) =>
            $.ajax({
                url: "/user/login",
                method: "POST",
                data: { user, password }
            }).done(function (result) {
                console.log(result.status.msg)
                if (result.status.error) {
                    rej(result.status.msg)
                } else {
                    app.user = { username: user, token: result.token }
                    res(undefined, result.token)
                }
            })
        )
    }

    register(user, password) {
        return new Promise((res, rej) =>
            $.ajax({
                url: "/user/register",
                method: "POST",
                data: { user, password }
            }).done(function (result) {
                console.log(result.status.msg)
                if (result.status.error) {
                    rej(result.status.msg)
                } else {
                    res(undefined, result.token)
                }
            })
        )
    }

    updateUsers() {
        var app = this
        return new Promise((res, rej) =>
            $.ajax({
                url: "/user",
                method: "GET"
            }).done(function (result) {
                if (result.status.error)
                    rej(result.status.msg)
                else {
                    console.log(result.users.map(i => i.username))
                    app.users = result.users.map(i => i.username)
                    res(undefined, app.users)
                }
            })
        )
    }

    updateMessages() {
        var app = this
        return new Promise((res, rej) =>
            $.ajax({
                url: "/message",
                method: "GET"
            }).done(function (result) {
                if (result.status.error)
                    rej(result.status.msg)
                else {
                    console.log(result.messages)
                    result.messages.map(i => {
                        app.messages[i.messageId] = {
                            from: i.username, // Sender
                            date: new Date("11/11/1111"), // Received date
                            content: i.value
                        }
                    })
                    res(undefined, result.messages)
                }
            })
        )
    }


    send(message) {
        var app = this
        return new Promise((res, rej) =>
            $.ajax({
                url: "/message",
                method: "POST",
                data : {message},
                headers: {
                    "x-token":app.user.token
                }
            }).done(function (result) {
                if (result.status.error)
                    rej(result.status.msg)
                else {
                    console.log(result)
                    res(undefined, result)
                }
            })
        )
    }
}

window.app = new App()