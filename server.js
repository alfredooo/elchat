var fs      = require('fs'),
    mime    = require('mime'),
    http    = require('http'),
    socket  = require('socket.io');

process.on('uncaughtException', function (err) {
    console.error(err.stack);
    console.log("Node NOT Exiting...");
});

//Create server
var port = process.env.PORT || 80;
var server  = http.createServer(init).listen(port),
    io      = socket['listen'](server);


io.configure(function () {
    //only for heroku!
io.set("transports", ["xhr-polling"]);
io.set("polling duration", 10);

    //more configurations
    io.set('log level', 1);
    /*
    0 - error
    1 - warn
    2 - info
    3 - debug
    */
io.enable('browser client minification');  // send minified client
    //io.enable('browser client etag');          // apply etag caching logic based on version number
  //  io.enable('browser client gzip');

//modifi//io.set('heartbeat timeout', 11);
});

function init(req, res) {
    var path = 'client'; //'client';

    if(req.url == '/'){
        path = path + '/index.html'
    }
    else{
        path = path + req.url;
    }

    fs.exists(path,function(exist){
        if(exist){
            fs.readFile(path,function(error,content){
                if (error){
                    res.writeHead(500);
                    res.end();
                } else {
                    res.writeHead(200,{'Content-Type':mime.lookup(path)});
                    res.end(content);
                }
            });
        }
        else{
            res.writeHead(404);
            res.end();
        }
    });
}

var GLOBALS = require('./js/globals.js'),
    User    = GLOBALS.User,
    Users   = GLOBALS.Users,
    Logger  = GLOBALS.Logger,
    Ucount  = GLOBALS.Ucount;

//TODO agregar try catch a todas las operaciones!
    io.sockets.on('connection', function(socket) {
    socket.on('login',onLogin);
    socket.on('logout',onLogout);
    socket.on('send',onSend);
    socket.on('modify',onModify);
    socket.on('disconnect',onDisconnect);

    var sid = socket.id;

    function onLogin(usrData) {
        if( !Users[sid] ) {
            var user = new User().init();
            user.load(usrData); //just load json properties.
            user.login(socket); //set socket, set user matches, etc...
            sendMatchesListMessage(user);
            sendAddUserMessage(user);
            Users[user.getKey()] = user;
            Logger.log("info","Login --> success");
            Logger.log("info","New login, users:" + (++Ucount) );
        }
        else {
            Logger.log("error","Login --> fail");
        }
    }

    function onLogout() {
        if( Users[sid] ) {
            var user = Users[sid]
            sendRemoveUserMessage(user);
            user.logout();
            Logger.log("info","Logout --> success - pre");
            delete Users[user.getKey()];
            Logger.log("info","Logout --> success");
        }
        else {
            Logger.log("error","Logout --> fail");
        }
    }

    function onSend(message){
        var rid = message['recipient'];
        if( Users[rid] && Users[sid] ) {
            var recipient = Users[rid],
                data = {
                    'responseType':'Message',
                    'data':message['data'],
                    'sender': sid
                };

            //Users[sid].addRecent(recipient);    //what is this? - alfredo
            sendDataMessage(recipient,data);
            Logger.log("info","Send --> success");
        }
        else {
            Logger.log("error","send  --> fail");
            //taria bueno enviar mensaje de error.
        }
    }

    function onModify(usrData) {
        if( Users[sid] ) {
            var user = Users[sid];
            sendRemoveUserMessage(user);
            user.modify(usrData);
            sendMatchesListMessage(user);
            sendAddUserMessage(user);
            Logger.log("info","Modify --> success");
        }
        else {
            Logger.log("error","Modify --> fail");
        }
    }

    function onDisconnect() {
        Logger.log("error","estoy en el disconect!! usocketId " + sid);
        onLogout();
    }
});

function sendMatchesListMessage(user) {
    var data = {
        'responseType' : "matchesList",
        'content' 	   : user.getMatches()
    };
    var message = {
        'type'  : "receive" ,
        'data'  : data,
        'socket' : user.getSocket()
    };
    sendMessage(message);
}

function sendAddUserMessage(user) {
    var data = {
        'responseType' : "addUser",
        'sender'	   : user.getKey(),
        'usr' 		   : user.getData()
    };
    var message = {
        'type'  : "receive" ,
        'data'  : data,
        'socket' : ""
    };

    for(var key in user.getMatches()) {
        var match = Users[key];
        if (match){
            message['socket'] = match.getSocket();
            sendMessage(message);
        }
    }
}

function sendRemoveUserMessage(user) {
    var data = {
        'responseType' : "removeUser",
        'sender'	   : user.getKey()
    };
    var message = {
        'type'  : "receive" ,
        'data'  : data,
        'socket' : user.getSocket()
    };
    for(var key in user.getMatches()) {
        var match = Users[key];
        if (match){
            message['socket'] = match.getSocket();
            sendMessage(message);
        }
    }
}

function sendDataMessage(user,data) {
    var message = {
        'type'  : "receive" ,
        'data'  : data,
        'socket' : user.getSocket()
    }
    sendMessage(message);
}
function sendMessage(message) {
    var type    = message['type'],
        data    = message['data'],
        socket  = message['socket'];

    try{
        socket.emit(type,data);
    }catch (ex){
        console.log(ex);
        console.log(data);
    }
}

