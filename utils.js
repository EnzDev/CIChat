/** Generate a standard return object
* @private
* @param {Boolean} status The error status
* @param {String} [msg=''] The message to use
*/
var genObj = (status, msg) => ({
    error: status,
    msg: msg || ''
});

/** Generate a failed object
 * @param {String} [msg='']
 */
module.exports.fail = (msg) => genObj(true, msg);

/** Generate a succeed object
 * @param {String} [msg='']
 */
module.exports.success = (msg) => genObj(false, msg);

/** Generate a long password with crypto
 * @returns {String} A random ascii password of length between 30 and 48
 */
module.exports.mkpassword = function () {
    let p, l = 0
    while (l < 30) {
        // Generate 48 bytes and remove non printable chars
        p = require('crypto').randomBytes(48).toString('ASCII').replace(/[^\x20-\x7E]/g, '')
        l = p.length
    }
    return p
}

const crypto = require('crypto');

/** Generate a new 32Bytes hex token for the User
 * @param {User} user A mongoose User instance
 */
module.exports.genToken = function (user) {
    user.token = crypto.randomBytes(32).toString('hex')
    user.expiration = Date.now() + 1000 * 60 * 60 // Make the token valid for 1 hour
}

/** Create a sha256 hash for the given string
 * @param {String} toHash The value to hash
 * @returns {String} The hashed result
 */
module.exports.hashAndDigest = function (toHash) {
    let hash = crypto.createHash('sha256')
    hash.update(toHash)
    return hash.digest('hex')
}

/** Format the string with the given code
 * @param {String} s The string to format
 * @param {Number} u Formatter code (typically an ANSI color code)
 */
var strC = (s, u)=> `\x1b[${u}m${s}\x1b[0m`

module.exports.blue  = (s) => strC(s, 34)
module.exports.green = (s) => strC(s, 32)
module.exports.red   = (s) => strC(s, 31)
