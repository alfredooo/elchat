var winston = require('winston');

var GLOBALS = {
    Users     : {},
    User      : require('./user.js').User,
    Searcher  : require('./searcher.js').Searcher,
    Logger    : new (winston["Logger"])({
        transports:[
            new (winston["transports"]["File"])({ filename: 'log.log',timestamp: true }),
            new (winston["transports"]["Console"])()
        ]
    }),
    Ucount    : 0, //users count
    Mlength   : 3 //min matches length
};
module.exports.Users    = GLOBALS.Users;
module.exports.User     = GLOBALS.User;
module.exports.Searcher = GLOBALS.Searcher;
module.exports.Logger   = GLOBALS.Logger;
module.exports.Ucount   = GLOBALS.Ucount;
module.exports.Mlength   = GLOBALS.Mlength;
