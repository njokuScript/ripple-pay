const jwt = require('jwt-simple');
const Redis = require('../services/redis');

let secret, redisTokenExpiry;

if (process.env.NODE_ENV=='production') {
    secret = process.env.SECRET;
    // making 30 mins for now, but change to 3 later
    exports.EXPIRE_TIME = 30*60*1000;
    
    redisTokenExpiry = exports.EXPIRE_TIME/1000;

} else {
    secret = require('../configs/config').SECRET;

    exports.EXPIRE_TIME = 100000000;
    redisTokenExpiry = 1;

}
// could this be problematic in different countries??
exports.tokenForUser = function (user) {
    let timeStamp = new Date().getTime();
    let expireStamp = new Date(timeStamp + exports.EXPIRE_TIME).getTime();
    Redis.setInCache("logged-in", user.id, true, redisTokenExpiry);

    const token = jwt.encode({
        sub: user.id,
        iat: timeStamp,
        exp: expireStamp
    }, secret);
    
    return token;
};
