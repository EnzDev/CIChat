var { red: r } = require('./utils') // Assign red it's shortcut

// Set the default port if no args and $env:PORT is not defined
var port =  process.env.PORT || 8081

require('./index.js').listen(port, () => console.warn(`I Server: Listening on port ${r(port)}`))