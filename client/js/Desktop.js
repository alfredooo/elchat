var isEmpty = function(obj) {
    return Object.keys(obj).length === 0;
}

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

var DesktopC = {
  'mainDivId'				:'mainDivId',
  'mainDivClassName'		:'mainDivClass',
  'defaultDesktopCss'		:'styles/defaultDesktop.css'
};

function Desktop(){}
Desktop.prototype = {
    init: function(id,container){

        this.id = id;
        this.user = null;
        this.messageBigBox = null;
        this.userDisplay = null;
        this.communicationController = new CommunicationController().setDesktop(this);
        this.mainDiv = document.createElement("div");
        this.mainDiv.id         = DesktopC.mainDivId;
        this.mainDiv.className  = DesktopC.mainDivClassName;
        container.appendChild(this.mainDiv);
        this.loadDefaultCss();
        this.commponents = new Array();
        this.chatBoxInstances = 0;
        this.checkNewEvents = false;

        return this;
    },
    loadOnCloseEvent: function(){

        window.onbeforeunload = function(event){
            return "vas a ser deslogueado, te queres ir igual?";
        }
        /**
         * no funciona siempre, por ejemplo en chrome se blokean muchas cosas y no siempre se ejecuta.
         * parece que hacer pooling en el logout no funciona... pero para algunos navegadores como chrome.
         * */
        window.onunload = function(){
            thisDesktop.logOff();
        }

        return false;
    },
    getCheckNewEvents:function(){

        return this.checkNewEvents;
    },
    logOff:function(){

        this.communicationController.logout();
    },
  	getMainContainer: function(){

  		return this.mainDiv;
  	},
    loadDefaultCss: function(){

        return this;
    },
    addWidget: function( element ){
        this.commponents[ element.getId() ] = element;
        return element;
    },
    removeWidget: function(id){
        this.commponents[ id ] = null;
        return this;
    },
    pleaseSendMessageNew:function(myId,to,eventType,jSonObject,responseTo,async){

        this.communicationController.addMessageNew(myId,to,eventType,jSonObject,responseTo,async);
        return this;
    },

    /**
     * Opens a chatBox instance and adds the instance to this desktop.
     * @param title of the chatBox instance - placed at the top.
     * @param owner component who owns the chatBox, for example the Desktop or a UserDisplay instance.
     * @param key identified used to know the user who I'm talking.
     */
    openChatBox:function(title,owner,key){

        var newChatBox = new ChatBox().init(this.chatBoxInstances++,this.getMainContainer(),title,owner,key);
        newChatBox.move(tagChat.constants.defaultComponentPositionX + this.chatBoxInstances*tagChat.constants.defaultMoveCof,tagChat.constants.defaultComponentPositionY + this.chatBoxInstances*tagChat.constants.defaultMoveCof);
        this.addWidget( newChatBox );
        return newChatBox;
    },
    getWidget: function(type){

        for(var i = 0;i<this.commponents.length;i++){
            if (this.commponents[i].getType()==type)
                return this.commponents[i];
        }
        return null;
    },
    modifyUser: function(newUserData,notifyServer){

        //if (this.user.k)
        this.user = newUserData;
        this.getUserDisplay().setNickName(this.user.nick);
        this.getUserDisplay().setTagsName(this.user.tags);

        if (notifyServer){
            this.communicationController.addMessageNew(null,null,tagChat.constants.operationsTypes.modify,this.user);
        }
    },
    removeTag:function(tag){

        var length = this.user.tags.length;
        for(var j=0;j<length;j++){
            if ( tag == this.user.tags[j] ){
                this.user.tags.splice(j,1);
            }
        }

        this.modifyUser(this.user,true);
    },

    /**
     * set the current user to the Desktop.
     * @param user
     */
    setUser:function( user ){

        this.user = user
        this.loadOnCloseEvent();
        return this;
    },
    getUser:function(){
        return this.user;
    },
    manageResponse:function(response){

        var localCopyMap = tagChat.constants.responseType;
        if ( response != null && response != '' ){
            try {

                //list with people who meets your tags...
                if ( response.responseType == localCopyMap.matchesList ){
                    this.getUserDisplay().manageResponse(response,localCopyMap);

                //new Personal message has arrived => UserDisplay is going to manage this...
                } else if (response.responseType == localCopyMap.newPersonalMessage){
                    if( this.user != null && this.getUserDisplay() != null ){
                        this.userDisplay.manageResponse(response,localCopyMap);
                    } else throw "newPersonalMessage - User or User Display is null";

                } else if ( response.responseType == localCopyMap.newUserArrived ){
                    if( this.user != null && this.getUserDisplay() != null ){
                        this.userDisplay.manageResponse(response,localCopyMap);
                    } else throw "new User Arrived - User or User Display is null";

                } else if ( response.responseType == localCopyMap.modifyUser ){
                    if( this.user != null && this.getUserDisplay() != null ){

                        this.modifyUser(response.usr);
                    } else throw "new User Arrived - User or User Display is null";

                } else if ( response.responseType == localCopyMap.removeUser ){
                    if( this.user != null && this.getUserDisplay() != null ){
                        this.userDisplay.manageResponse(response,localCopyMap);
                    } else throw "Remove User - User or User Display is null";
                }

            } catch (exp){
                console.log("[Desktop - manageResponse] Not expected response: " + response + " [Exception] : "+ exp);
            }
        }
    },
    getUserDisplay:function(){

        if ( this.userDisplay == null ){
             this.userDisplay = this.getWidget("UserDisplay");
             if ( this.userDisplay == null && this.user != null ){
                 this.userDisplay = this.addWidget( new UserDisplay().init(this.commponents.length,this) );
                 this.userDisplay.setNickName(this.user.nick);
                 this.userDisplay.setPersonalMessage("mensaje personal por defecto");
                 this.userDisplay.setTagsName(this.user.tags);
            } else if ( this.user == null ) throw "trying to create UserDisplay but no user is configured.";
        }
        return this.userDisplay;
    },
    showMessage:function(text){

        this.messageBigBox = document.createElement("div");
        this.messageBigBox.className = "BigBoxMessageClass";
        var description = document.createElement("span");
        description.textContent = text;

        this.messageBigBox.appendChild(description);
        this.mainDiv.appendChild(this.messageBigBox);
    },
    hideMessage:function(){
        if (this.messageBigBox){
            this.mainDiv.removeChild(this.messageBigBox);
            delete this.messageBigBox;
            this.messageBigBox = null;
        }
    },
    getCommunicationController:function(){
        return communicationController;
    }
};