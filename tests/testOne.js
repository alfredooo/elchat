/**
 * Created with JetBrains WebStorm.
 * User: añslkdjfsdfk
 * Date: 08/12/12
 * Time: 02:04 PM
 * To change this template use File | Settings | File Templates.
 */

var should = require('should');
var io = require('socket.io-client');

var socketURL = 'http://0.0.0.0:80';

var options ={
    transports: ['websocket'],
    'force new connection': true
};

var tagChat = {
    constants:{
        commInterval:1*1000,
        defaultComponentPositionX:50,
        defaultComponentPositionY:50,
        defaultMoveCof:20,
        //serverUrl:"http://localhost:8080/View/",
        serverUrl:":80/",     //default port 80!
        responseType:{"matchesList":"matchesList",
            "pendingEvents":"pendingEvents",
            "newPersonalMessage":"Message",
            "newUserArrived":"addUser",
            "removeUser":"removeUser",
            "modifyUser":"ModifyUser"},
        operationsTypes:{"sendEvent":"send","logOut":"logout","receiveEvents":"receive_events","logIn":"login","modify":"modify"},
        defaultMessageFormat:"users?operation="
    },
    globalVariables:{
        runningEvents:{}
    }
};

var chatUser1 = {"nick":"leoooo","tags":["uruguay", "amigos"]};
var chatUser2 = {"nick":"juancito","tags":["uruguay", "amigos"]};
var chatUser3 = {"nick":"menganito","tags":["uruguay", "amigos"]};

describe("Chat Server",function(){


    it('Should broadcast new user to all users', function(done){
        var client1 = io.connect(socketURL, options);

        client1.on('connect', function(data){

            //firt I do log in of chat user 1.
            client1.emit(   tagChat.constants.operationsTypes.logIn, chatUser1  );

            var client2 = io.connect(socketURL, options);
            client2.on('connect', function(data){
                client2.emit(tagChat.constants.operationsTypes.logIn, chatUser2);
            });

            client1.on('receive', function(data) {
                console.log("[testing "+ chatUser2.nick +"] on receive: " + data);
            });
        });

        client1.on('receive', function(data) {
            console.log("[testing "+ chatUser1.nick +"] on receive: " + data);
        });
    });
});

