var UserDisplayC = {
    'mainDivId'				:'mainDivUDisplay',
    'myNickNameId'          :'myNickNameId',
    'myTagsId'              :'myTagsId',
    "myPersonalMessId"      :'myPrivateMessageId',
    "mainContactDiv"        :'contactDiv',

    'mainDivClassName'      :'mainDivUDisplayClass',
    'mainHeaderClassName'   :'mainHeaderUDisplayClass',
    'headerClassRightName'  :'headerRightClassName',
    'headerClassLeftName'   :'headerLeftClassName',
    'nickNameClass'         :'nickNameUserDisplayClass',
    'tagsNameClass'         :'tagsClassUserDisplay',
    'privateNameClass'      :'privateMessageUserDisplayNameClass',
    'defaultCss'            :'styles/defaultUserDisplay.css',
    'personImage'           :'userDisplayPersonClass',

    'personImage_src'       :'images/person.png'
};

function UserDisplay(){}
UserDisplay.prototype = {
    init: function(id,desktop){

        this.desktop = desktop;
        this.contacts = 0;
        this.currentTopZIndex = 0;
        this.container = desktop.getMainContainer();
        this.type = "UserDisplay";
        this.initializeStructureAndEvents();
        this.loadDefaultStyle();

        this.maxDisplayingContacts = 107;
        this.hidenContacts = new Array();
        this.currentConversations = new Array();
        this.currentContacts = new Array();

        this.desktop.hideMessage();
        return this;
    },
    getDesktop:function(){
        return this.desktop;
    },
    getType: function(){
        return this.type;
    },
    getId: function(){
        return this.mainDiv.id;
    },
    initializeStructureAndEvents: function(){

        this.mainDiv = document.createElement('div');
        this.mainDiv.id = UserDisplayC.mainDivId;
        this.mainDiv.className = UserDisplayC.mainDivClassName;

        this.mainDiv.appendChild(   this.getHeader()  );
        this.mainDiv.appendChild(   this.getMiddle()  );
        this.mainDiv.appendChild(   this.getFooter()  );
        this.container.appendChild( this.mainDiv        );

        this.mainDiv.style.left = "70%";
        this.mainDiv.style.top  = "10%";

        this.mydrag = new Draggable(UserDisplayC.mainDivId,{handle:UserDisplayC.myNickNameId});
        return this;
    },
    getHeader:function(){

        var mainHeaderDiv   = document.createElement('div');
        var rightDiv        = document.createElement('div');
        var photoImage      = document.createElement('img');
        photoImage.src = UserDisplayC.personImage_src;
        photoImage.className = UserDisplayC.personImage;

        rightDiv.appendChild(  photoImage  );

        var leftDiv = document.createElement('div');
        var myNickNameDiv = document.createElement('div');
        this.myNickName = document.createElement('span');
        this.mytags = document.createElement('div');
        this.myPrivateMessage = document.createElement('dialog');

        myNickNameDiv.appendChild(this.myNickName);

        leftDiv.appendChild( myNickNameDiv );
        leftDiv.appendChild( this.mytags );
        leftDiv.appendChild( this.myPrivateMessage );

        mainHeaderDiv.appendChild(rightDiv);
        mainHeaderDiv.appendChild(leftDiv);

        this.mytags.id              = UserDisplayC.myTagsId;
        this.myNickName.id          = UserDisplayC.myNickNameId;
        this.myPrivateMessage.id    = UserDisplayC.myPersonalMessId;

        mainHeaderDiv.className     = UserDisplayC.mainHeaderClassName;
        rightDiv.className          = UserDisplayC.headerClassRightName;
        myNickNameDiv.className = "MyNickNameDiv";
        this.myNickName.className      = UserDisplayC.nickNameClass;
        this.mytags.className          = UserDisplayC.tagsNameClass;
        this.myPrivateMessage.className= UserDisplayC.privateNameClass;
        leftDiv.className           = UserDisplayC.headerClassLeftName;

        return mainHeaderDiv;
    },
    getMiddle:function(){

        this.middleDiv = document.createElement('div');
        return this.middleDiv;
    },
    addContact:function(user){

        var key = user.key;
        if ( this.currentContacts[key] != null && this.currentContacts[key] != undefined ){

            console.log("[UserDisplay] trying to add a user without key.");
        } else {

            this.currentContacts[user.key] = user;
            this.addContactVisualization(user.key,user.nick,user.personal_msg,user.tags,user.key);
        }
    },
    addContactVisualization:function(id,nickNameText,personalMessage,tags,key) {

        var mainContactDiv = document.createElement('div');
        mainContactDiv.id  = UserDisplayC.mainContactDiv + id;
        mainContactDiv.className = UserDisplayC.mainHeaderClassName;


        /****        left div!           */

        var mainLeftContactDiv = document.createElement('div');
        var photoImage      = document.createElement('img');

        mainLeftContactDiv.appendChild(photoImage);
        photoImage.src = UserDisplayC.personImage_src;  //to be changed

        photoImage.className = UserDisplayC.personImage;
        mainLeftContactDiv.className    = UserDisplayC.headerClassLeftName;

        mainContactDiv.appendChild(mainLeftContactDiv);

        /****        right div!           */
        var mainRightContactDiv = document.createElement('div');
        var nameAndTagsDiv      = document.createElement('div');
        var nameDiv             = document.createElement('div');
        var tagsDiv             = document.createElement('div');
        var personalMessageDiv  = document.createElement('div');

        mainRightContactDiv.className = UserDisplayC.headerClassRightName;
        nameAndTagsDiv.className = "nameAndTagsDiv";
        personalMessageDiv.className = "perssonalMessageDiv";
        nameDiv.className = "nameDiv";
        tagsDiv.className = "tagsDiv";

        mainRightContactDiv.appendChild( nameAndTagsDiv );
        mainRightContactDiv.appendChild( personalMessageDiv );

        nameAndTagsDiv.appendChild(nameDiv);
        nameAndTagsDiv.appendChild(tagsDiv);

        mainContactDiv.appendChild(mainRightContactDiv);

        var nickName  = document.createElement('span');
        var tagsSpan   = document.createElement('span');
        var privateMessage = document.createElement('dialog');

        nickName.className  = UserDisplayC.nickNameClass + ' pointer';
        tagsSpan.className  = UserDisplayC.tagsNameClass;
        privateMessage.className  = UserDisplayC.privateNameClass;


        nameDiv.appendChild( nickName );
        tagsDiv.appendChild( tagsSpan );
        personalMessageDiv.appendChild( privateMessage );

        nickName.textContent          = nickNameText;
        nickName.setAttribute('key',key);

        var myInstance = this;
        jQuery(nickName).bind('click',function(){
            myInstance.manageChatBoxCreation( nickName.getAttribute('key') );
        });

        if (personalMessage){
            privateMessage.textContent    = personalMessage;
        } else privateMessage.textContent    = "mensaje personal por defecto";

        var last = tags.length-1;
        var myTagsString = "";
        for(var i = last;i>= 0;i--){
            if (i<last){
                myTagsString += ' ';
            }
            myTagsString += tags[i];
        }

        tagsSpan.textContent = myTagsString;

        /**********************************/

        this.contacts++;
        this.middleDiv.appendChild(mainContactDiv);
    },
    removeContact:function(key){

        var mainContactDiv = jQuery('#'+UserDisplayC.mainContactDiv + key);
        mainContactDiv.unbind();
        this.middleDiv.removeChild(document.getElementById(UserDisplayC.mainContactDiv + key));
        //deberia avisar que se desconecto el usuario si estoy hablando con el!
        this.currentContacts[key] = null;
    },
    modifyContact:function(contact){

        var mainContactDiv = jQuery('#'+UserDisplayC.mainContactDiv + contact.key);
    },
    manageChatBoxCreation:function( contactUuid ){

        if ( !this.currentConversations[contactUuid] ){
            this.currentConversations[contactUuid] = this.desktop.openChatBox( this.currentContacts[contactUuid].nick,this,contactUuid);
        }
        this.currentConversations[contactUuid].callAtention(++this.currentTopZIndex);
        return this.currentConversations[contactUuid];
    },
    disassociateChatBox:function(chatBox){

        this.desktop.removeWidget(chatBox.getId());
        this.currentConversations[chatBox.key] = null;
    },

    /**
     * Manages the response if it is related to this component.
     * It generates the graphic interfaces needed to show the content of the response object.
     * Response object types are: {matchesList,newPersonalMessage,newUserArrived}
     * @param response => json object having all the information from the server.
     * @param responseType  => defaults responseTypes to check from.
     */
    manageResponse:function( response,responseType ){

        if ( response.responseType == responseType.matchesList ){

            var count = 0;
            var userList = response.content;
            for(var key in userList){
                if (count < this.maxDisplayingContacts){

                    this.addContact(userList[key]);
                } else {

                    this.hidenContacts.push( userList[key] );
                }
                count++;
            }
        }

        else if ( response.responseType == responseType.newPersonalMessage ){
            var text = response.data;
            var sender = response.sender;
            //var recipient = response.recipient;
            var chatBox = this.manageChatBoxCreation(sender);
            chatBox.addHistoryEntry( this.currentContacts[sender].nick + " : " +text);
        }

        else if ( response.responseType == responseType.newUserArrived ){

            this.addContact(response.usr);
        }

        else if ( response.responseType == responseType.removeUser ){

            this.removeContact(response.sender);
        }
    },
    getFooter:function(){
        return document.createElement("div");
    },
    loadDefaultStyle: function(){
        //includeCssFileJquery(UserDisplayC.defaultCss);
        return this;
    },
    setNickName:function(nickName){
        jQuery('#'+UserDisplayC.myNickNameId).text(nickName);
    },
    setPersonalMessage:function(message){
        jQuery('#'+UserDisplayC.myPersonalMessId).text(message);
    },
    onRemoveTag:function(event){
        var tag = event.target.getAttribute("tagName");
        thisDesktop.removeTag(tag);
    },

    /**
     * ---> recives an array
     **/
    setTagsName:function(tags){

        while (this.mytags.hasChildNodes()) {
            this.mytags.removeChild(this.mytags.lastChild);
        }

        var tagDivContainer = document.createElement('div');
        var last = tags.length;
        for(var i = 0;i<last;i++){

            var newTagMainDiv = document.createElement('div');
            var newTagDivText = document.createElement('div');
            var newTagDivXButton = document.createElement('div');
            var newTagSpan = document.createElement('span');
            var newTagSpanXButton = document.createElement('span');

            newTagSpan.textContent = tags[i];
            newTagSpanXButton.textContent = "X";

            newTagDivText.appendChild(newTagSpan);
            tagDivContainer.appendChild(newTagMainDiv);
            newTagMainDiv.appendChild(newTagDivText);
            newTagDivText.appendChild(newTagDivXButton);

            newTagDivXButton.appendChild(newTagSpanXButton);

            newTagMainDiv.className = "newTagMainDiv";
            newTagDivText.className = "personalTagDiv";
            newTagSpan.className = "personalTagSpan";

            //newTagDivText.className = "personalTagDivText";
            newTagDivXButton.className = "newTagDivXButton";


            newTagDivXButton.addEventListener("click",this.onRemoveTag);
            newTagSpanXButton.setAttribute("tagName",tags[i]);
        }
        tagDivContainer.className = "personalTagDivContainer";
        this.mytags.appendChild( tagDivContainer );
    }
};