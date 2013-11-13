/*
 * Nuestro primer Windget.. eje
 * hay que definir bien las interfases que to do windgetdebe tener... bah operaciones!
 * 
 * se me ocurren:
 * 		constructor(id,container);
 * 		setContainer(container);
 * 		init();
 * 		remove();
 * 		loadDefaultCss();
 * 		setElementHashMap(elementHashmap);
 * */
//dejando atraz la indiferencia.
 var TaggerC = {
  'mainDivId'				:'mainDivTagger',
  'mainDivClassName'		:'mainDivClassTagger',
  'defaultCss'				:'styles/defaultTagger.css',

  'inputBoxClassName'		:'Tag_inputBoxClassName',
  'inputBoxId'              :'inputBoxId',

  'nickBoxId'				:'nickBoxId',
  'nickBoxClass'			:'nickBoxClass',
  'Nickid'					:'nickId',
  'nickClass'				:'nickSpanClass',
  'NickInputId'				:'nickInput',
  'nickInputClass'			:'nickInputClass',

  'nickSendButtonId'		:'nickSendButtonId',
  'nickSendButtonClass'		:'nickSendButtonClass'
};

function Tagger(){}
Tagger.prototype = {
    init: function(id,desktop) {

        this.desfaultValue = "sobre que te gustaria hablar?";

        this.nickBox = null;
        this.desktop = desktop;
        this.type = "Tagger";
        this.container = desktop.getMainContainer();
        this.mainDiv = document.createElement("div");
        this.mainDiv.id         = TaggerC.mainDivId;
        this.mainDiv.className  = TaggerC.mainDivClassName;
        
        var inputBox = document.createElement("input");
        inputBox.id = TaggerC.inputBoxId;
        inputBox.type = "text";
        inputBox.value = this.desfaultValue;
        inputBox.className = TaggerC.inputBoxClassName;

        this.mainDiv.appendChild(inputBox);
        this.container.appendChild(this.mainDiv);

        this.addEvents();
        this.loadDefaultCss();
        this.mydrag = new Draggable(TaggerC.mainDivId,{ scroll: window });
        inputBox.focus();
        return this;
  },
    getType: function(){
        return this.type;
    },
    addEvents : function(){

        var instance = this;
        jQuery('#' + TaggerC.inputBoxId).keypress(function(event) {
            if (event.which == '13') {
             instance.showNickBox();
            } else if (this.value == instance.desfaultValue){
                this.value = "";
            }
        });

        jQuery('#' + TaggerC.inputBoxId ).click(function() {
            this.value = "";
        });
    },
    loadDefaultCss: function(){
        //includeCssFileJquery(TaggerC.defaultCss);
        return this;
   },
   	getId: function(){
   		return this.mainDiv.id;
   	},
    closeNickBox:function(){
        jQuery('#' + TaggerC.nickBoxId).fadeOut('slow');
        this.mainDiv.removeChild(document.getElementById(TaggerC.nickBoxId));
        this.nickBox = null;
    },
   	showNickBox:function(){

        if ( this.nickBox == null ){

            var instanceThis = this;
            this.nickBox = document.createElement("div");
            this.nickBox.id = TaggerC.nickBoxId;
            this.nickBox.className = TaggerC.nickBoxClass;

            var nickNameSpan = document.createElement('span');
            nickNameSpan.id  = TaggerC.Nickid;
            nickNameSpan.className = TaggerC.nickClass;
            nickNameSpan.innerHTML = "nickName";

            var nickNameInput = document.createElement('input');
            nickNameInput.id  = TaggerC.NickInputId;
            nickNameInput.className = TaggerC.nickInputClass;

            var sendButton  = document.createElement('div');
            sendButton.id   = TaggerC.nickSendButtonId;
            sendButton.className = TaggerC.nickSendButtonClass;
            var textInside = document.createElement('span');
            sendButton.appendChild(textInside);
            textInside.textContent = "entrar";

            var closeButton  = document.createElement('div');
            closeButton.id   = "nick_closeButton";
            closeButton.className = "nick_closeButtonClass";
            closeButton.innerHTML = 'X';
            closeButton.addEventListener('click',function () {
                instanceThis.closeNickBox();
            },false);

            this.nickBox.style.display = 'none';
            this.nickBox.appendChild(     closeButton     );
            this.nickBox.appendChild(     nickNameSpan    );
            this.nickBox.appendChild(     nickNameInput   );
            this.nickBox.appendChild(     sendButton      );
            this.mainDiv.appendChild(     this.nickBox    );

            jQuery('#' + TaggerC.NickInputId).keypress(function(event) {
                if ( event.which == '13' ) {
                    instanceThis.sendInformation();
                    instanceThis.closeAll();
                }
            });

            jQuery('#' + TaggerC.nickSendButtonId).click(function(event) {

                instanceThis.sendInformation();
                instanceThis.closeAll();
            });

            jQuery('#' + TaggerC.nickBoxId).fadeToggle("slow", "linear");
            jQuery('#' + TaggerC.NickInputId).focus();
        }
   	},
    closeAll : function(){

        this.closeNickBox();
        this.mydrag.destroy();
        this.container.removeChild( this.mainDiv );

        this.nickBox = null;
        this.desktop = null;
        this.type = null;
        this.container = null;
        this.mydrag = null;
        this.mainDiv = null;
        this.__proto__ = null;
    },
    sendInformation : function(){

        this.sendInformationToDesktop(jQuery("#" + TaggerC.inputBoxId).val(),jQuery("#" + TaggerC.NickInputId ).val());
    },
    sendInformationToDesktop:function(tags,userName){

        var tagsList = tags.split(" ");
        var userTags = [tagsList[0]];
        for(var i= 1;i<tagsList.length;i++){
            userTags[i] = tagsList[i];
        }
        var currentUser = {"nick":userName,"tags": userTags};
        this.desktop.pleaseSendMessageNew(TaggerC.mainDivId,
            tagChat.constants.serverUrl,
            tagChat.constants.operationsTypes.logIn,
            currentUser,this.desktop)
            .setUser(currentUser);
        this.desktop.showMessage("por favor espera mientras cargamos los usuarios... gracias!");
    }
};