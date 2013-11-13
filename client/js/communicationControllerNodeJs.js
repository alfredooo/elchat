/**
 * Created with JetBrains WebStorm.
 * User: alfredo
 * Date: 24/07/12
 * Time: 12:47 AM
 * To change this template use File | Settings | File Templates.
 */

function CommunicationController(){

    //this.desktop = desktop;
    this.socket = io.connect('/');

    this.onReceive = function(data){

        this.desktop.manageResponse(data);
    };

    this.onUpdateUsers = function(data){

        console.log(data);
    };
    this.addMessageNew = function(myId,to,eventType,jSonObject,responseTo,async){

        this.socket.emit(eventType,jSonObject);
        return this;
    };
    this.setDesktop = function(desk){
        this.desktop = desk;
        return this;
    };

    this.logout = function(){

        this.socket.emit(tagChat.constants.operationsTypes.logOut,{});
    }

    var instance = this;
    function onReceiveFunction(data){
        instance.onReceive(data);
    }

    this.socket.on('updateusers',this.onUpdateUsers);
    this.socket.on("receive",onReceiveFunction);
    return this;
}