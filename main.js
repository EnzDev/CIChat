var utils = require('./utils') // Import coloration
var { red: r, green: g, blue: b } = utils // Assign red/green/blue to their shortcut

// Set the default port if no args and $env:PORT is not defined
var port =  process.env.PORT || 8080

require('./index.js').listen(port, () => console.log(`I Server: Listening on port ${r(port)}`))