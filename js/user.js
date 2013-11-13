var GLOBALS  = require('./globals.js');

function User(){};
User.prototype = {
    init:function(){
		this.user = {
		    "key"		: "",
            "nick"		: "",
            "name"		: "",
            "password" 	: "",
            "status"	: "",
            "age"		: 0,
            "pmsg"		: "",
            "tags"		: [],
            "matches"	: {},
            "recents"   : {},
            "socket"    : ""
		};
		return this;
	},

	load:function(json) {

		this.setKey(json['key']);
		this.setNick(json['nick']);
		this.setTags(json['tags']);
		this.setMatches(json['matches']);
	},

	login:function(socket) {

		this.setKey(socket.id);
        this.setSocket(socket);
    	this.updateMatches();
	},

    logout:function() {

        for(var key in this.getMatches()) {
            var match = GLOBALS.Users[key];
            this.removeMatch(match);
            match.removeMatch(this);
        }
        this.setTags([]);
        this.setSocket("");
    },

    modify:function(json) {

        this.setNick(json['nick']);
        this.setTags(json['tags']);
        this.updateMatches();
    },

   	addMatch:function(match) {
		this.getMatches()[match.getKey()] = match.getData();
		match.getMatches()[this.getKey()] = this.getData();
	},

    removeMatch:function(match) {
        delete this.getMatches()[match.getKey()];
        delete match.getMatches()[this.getKey()];
    },

    updateMatches:function() {
        this.setMatches({});
        var matches = GLOBALS.Searcher.getMatches(this);

        for(var key in matches) {
            var usr  = matches[key];
            if (usr.getKey() != this.getKey()){
                this.addMatch(usr);
            }
        }
    },
    //tagArray should be array of strings tat represent tags.
    getHowManyMatches:function(tagArray){

        var count = 0;
        for(var i = 0;i<this.getTags().length;i++){

            for(var j=0;j<tagArray.length;j++){
                if (tagArray[j].indexOf(this.getTags()[i]) >= 0){
                    count++;
                }
            }
        }

        return count;
    },
    getData:function() {
		var data = {
			"key" 	  : this.user['key'],
			"nick"	  : this.user['nick'],
			"tags"	  : this.user['tags']
		};
		return data;
	},

	getKey:function() {
		return this.user.key;
	},

	getNick:function() {
		return this.user.nick;
	},

	getMatches:function() {
		return this.user.matches;
	},
	getTags:function() {
		return this.user.tags;
	},

	setKey:function(value) {
		this.user.key = value;
	},

	setNick:function(value) {
		this.user.nick = value;
	},

	setMatches:function(value) {
		this.user.matches = value;
	},
	setTags:function(value) {
		this.user.tags = value;
	},

    getSocket:function() {
        return this.user.socket;
    },

    setSocket:function(value) {
        this.user.socket = value;
    },

	toString:function() {
		return JSON.stringify(this.user);
	}
};
module.exports.User = User;
