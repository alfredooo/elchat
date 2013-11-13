var ChatBoxC = {
    'mainDivClassName'				:'mainDivChatBoxClass',
    'defaultCss'                    :'styles/defaultChatBox.css',
    'chatBoxCloseClass'             :'chatBoxCloseClass',
    'chatBoxMinimizeClass'          :'chatBoxMinimizeClass',
    'chatBoxTitleClass'             :'chatBoxTitleClass',
    'chatBoxHeaderClass'            :'chatBoxHeaderClass',

    'chatBoxMiddleClass'            :'chatBoxMiddleClass',
    'chatBoxMSpaceClass'            :'chatBoxMSpaceClass',
    'chatBoxDialogClass'            :'chatBoxDialogClass',
    'chatBoxHistoryEntry'           :'historyEntry',
    'chatBoxHistoryDiv'             :'chatBoxHistoryDiv',

    'chatBoxFooterClass'            :'chatBoxFooterClass',
    'chatBoxFTextBoxClass'          :'chatBoxFTextBoxClass',
    'chatBoxFAcceptButClass'        :'chatBoxFAcceptButClass',
    'chatBoxDialogText'             :'chatBoxDialogText',

    'chatBoxTitleDivId'             :'chatBoxTitleDivId',
    'chatBoxTextId'                 :'textId'
};

function EmoticonsPanel(){}
var DefaultEmoticons = {"size":"15","emoticons":[{";)":"1",":)":"2"}]};
EmoticonsPanel.prototype = {
    init:function(emoticonsArray){

        this.widht  = 200;
        this.height = 300;
        this.emoticonsArray = emoticonsArray;
        this.listeners = new Array();
        this.size = emoticonsArray.size;
    },
    show:function(){

        var current  = 0;
        var mainDiv  = document.createElement('div');
        var table_   = document.createElement('table');
        var hor_elements =  Math.Round( this.widht/this.size );
        for( var i = 0;i<hor_elements;i++ ){

        }
    },
    hide:function(){},
    addListener:function(listener){},
    removeListener:function(listener){},
    completeRemove:function(){}
}

function ChatBox(){}
ChatBox.prototype = {
    init: function(id,container,username,owner,key){

        this.id = id;
        this.owner = owner; //user Display
        this.type = "ChatBox";
        this.username = username;
        this.key = key;
        this.title = 'Hablando con ' + username;
        this.container = container;

        this.initializeStructureAndEvents();
        this.loadDefaultStyle();
        return this;
    },
    callAtention:function(z){
        this.mainDiv.style.zIndex = z;
    },
    getType: function(){
        return this.type;
    },
    getId: function(){
   		return this.mainDiv.id;
   	},
    getUserName: function(){
   		return this.username;
   	},
    destroyBox:function(){

        var instance = this;
        this.owner.disassociateChatBox(this);


        jQuery(this.mainDiv).hide('slow', function() {

            jQuery(instance.dialogText).unbind();
            jQuery(instance.closeDiv).unbind();
            $(this.id).remove();    //removes the div using prototype...

            instance.id = null;
            instance.owner = null;
            instance.type = null;
            instance.username = null;
            instance.title = null;
            instance.container = null;
            instance.dialogs = null;
            instance.dragTitle = null;

            instance.footer = null;
            instance.mainDiv = null;
            instance.middleDiv = null;
            instance.dialogText = null;
            instance.closeDiv = null;
            instance.__proto__ = null;  //see how I can destroy this ...
            console.log("removed a chat box.");
          });



    },
  	initializeStructureAndEvents: function(){

        this.mainDiv = document.createElement('div');
        this.mainDiv.id = this.id;
        this.mainDiv.style.display = 'none';
        this.mainDiv.className = ChatBoxC.mainDivClassName;

        this.mainDiv.appendChild(   this.getHeader()    );
        this.mainDiv.appendChild(   this.getMiddle()    );
        this.mainDiv.appendChild(   this.getFooter()    );
        this.container.appendChild( this.mainDiv        );

        this.addFunctionalities();

        jQuery(this.mainDiv).fadeToggle("slow", "linear");
        //jQuery(this.mainDiv).focus();
        return this;
  	},
    getHeader:function(){

        var mainHeaderDiv   = document.createElement('div');
        var chatBoxTitle    = document.createElement('span');
        var titleDiv        = document.createElement('div');

        var title = document.createTextNode( this.title );
        chatBoxTitle.appendChild(title);
        titleDiv.appendChild(chatBoxTitle);

        this.closeDiv        = document.createElement('div');
        var minimizeDiv     = document.createElement('div');

        var xLetter = document.createElement("span");
        xLetter.textContent = "X";
        this.closeDiv.appendChild(xLetter);
        var instance = this;
        jQuery(this.closeDiv).bind('click',function(){instance.destroyBox();});
        //this.closeDiv.addEventListener("click",,false);
        xLetter.className = "closeLetterClass";

        mainHeaderDiv.appendChild(titleDiv);
        mainHeaderDiv.appendChild(this.closeDiv);
        mainHeaderDiv.appendChild(minimizeDiv);

        mainHeaderDiv.className = ChatBoxC.chatBoxHeaderClass;
        titleDiv.className      = ChatBoxC.chatBoxTitleClass;
        this.closeDiv.className      = ChatBoxC.chatBoxCloseClass;
        minimizeDiv.className   = ChatBoxC.chatBoxMinimizeClass;

        titleDiv.id = this.id + ChatBoxC.chatBoxTitleDivId;
        jQuery(titleDiv).bind('click',function(){
            instance.callAtention( ++instance.owner.currentTopZIndex );
        });

        return mainHeaderDiv;
    },
    addFunctionalities :function(){

        var instanceThis = this;
        /**
         * Event to do the box draggable.
         */
        this.dragTitle = new Draggable(this.mainDiv.id,{handle:this.id + ChatBoxC.chatBoxTitleDivId});
        try{
            jQuery(this.mainDiv).addClass("ui-widget-content");
            jQuery(this.mainDiv).resizable();
        }catch(exeption){
            alert(exeption);
        }

        /**
         * event to add Histroy Entry.
         */
        jQuery(this.dialogText).bind('keypress',function(event) {
            if (event.which == '13') {
                instanceThis.manageEnteredText( this.value );
                event.preventDefault();
                this.value = null;
            }
        });

        return this;
    },
    manageResponse:function(data){

        if (data != ''){
            this.addHistoryEntry(data);
        }
    },
    manageEnteredText:function(text){

        var constants = tagChat.constants;
        var ownerNick = this.owner.getDesktop().getUser().nick;
        this.addHistoryEntry( ownerNick + " : " + text );
        var jsonObject = {"responseType":constants.responseType.newPersonalMessage,"data":text,"recipient":this.key};
        this.owner.getDesktop().pleaseSendMessageNew(this.id,constants.serverUrl,constants.operationsTypes.sendEvent,jsonObject,this,false);
    },
    getMiddle:function(){

        this.middleDiv  = document.createElement('div');
        var space       = document.createElement('div');
        this.dialogs    = document.createElement('div');

        this.middleDiv.className        = ChatBoxC.chatBoxMiddleClass;
        space.className                 = ChatBoxC.chatBoxMSpaceClass;
        this.dialogs.className          = ChatBoxC.chatBoxDialogClass;

        this.middleDiv.appendChild( space );
        this.middleDiv.appendChild(this.dialogs);
        return this.middleDiv;
    },
    getFooter:function(){

        this.footer = document.createElement('div');        //main footer div...
        var textBox = document.createElement('div');        //text box div...
        this.dialogText = document.createElement('textarea');

        this.footer.className       = ChatBoxC.chatBoxFooterClass;
        textBox.className           = ChatBoxC.chatBoxFTextBoxClass;
        this.dialogText.className   = ChatBoxC.chatBoxDialogText;

        this.dialogText.id = this.id + ChatBoxC.chatBoxTextId;
        this.footer.appendChild(this.getEmoticonsDiv());
        this.footer.appendChild( textBox );
        textBox.appendChild( this.dialogText );

        return this.footer;
    },
    /**
     * builds the panel where the emoticons button will be placed.
     */
    getEmoticonsDiv:function(){

        var emoticonsDiv = document.createElement('div');   //emoticons div
        var emoticonsContainerDiv = document.createElement('div');
        var emoticonImage = document.createElement('img');

        return emoticonsDiv;
    },
    addHistoryEntry:function(message){

        var newEntry     = document.createElement("div");
        var newSpanEntry = document.createElement("span");

        newSpanEntry.textContent = message;
        newEntry.appendChild( newSpanEntry );
        this.dialogs.appendChild( newEntry );

        newSpanEntry.className = ChatBoxC.chatBoxHistoryEntry;
        newEntry.className = ChatBoxC.chatBoxHistoryDiv;

        this.dialogs.scrollTop = this.dialogs.scrollHeight;
        //jQuery('#' + this.id).focus();    do not work-..
        return this;
    },
  	loadDefaultStyle: function(){

  		//includeCssFileJquery(ChatBoxC.defaultCss);  //think about this..
        return this;
  	},
    move: function(x,y){

        this.mainDiv.style.left = x + 'px';
        this.mainDiv.style.top  = y + 'px';
        this.mainDiv.style.position = 'absolute';
    }
};