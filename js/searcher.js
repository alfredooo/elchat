var GLOBALS = require('./globals.js');

function Searcher(){};
Searcher.prototype = {

    //get matches
    //podria agregar poda! no pasar maximo...
    getMatches:function(user){
        var Users   = GLOBALS.Users,
            matches = {},
            count   = 0;

        var counter = 0;
        var matchesValuesOfUsersArray = {};
        for(var key in Users) {

            var usr  = Users[key];
            var number = user.getHowManyMatches(usr.getTags());
            if(!matchesValuesOfUsersArray[number]){
                matchesValuesOfUsersArray[number] = new Array();
            }
            matchesValuesOfUsersArray[number].push(usr);
        }

        var matchesValueArray = new Array();
        for(howManyMatchesValue in matchesValuesOfUsersArray){
            matchesValueArray.push(howManyMatchesValue);
        }

        counter = 0;
        matchesValueArray.sort();
        for(var i=matchesValueArray.length-1;i>=0;i--){
            for(var j= 0;j<matchesValuesOfUsersArray[matchesValueArray[i]].length;j++){
                var userrr = matchesValuesOfUsersArray[matchesValueArray[i]][j];
                matches[userrr.getKey()] = userrr;
                counter++
                if (counter >= GLOBALS.Mlength){
                    return matches;
                }
            }
        }

        return matches;
    },

    //get match rate
    getRate:function(usr1,usr2){
        if ( usr1.getKey() == usr2.getKey() ){
            return 0;
        }
        else{
            var tags1 = usr1.getTags(),
                tags2 = usr2.getTags(),
                rate  = this.tagsInTags(tags1,tags2);
            return rate;
        }
    },

    //test tags1 in tags2
    tagsInTags:function(tags,Tags){
        var rate = 0;

        for(var index in tags){
            var tag = tags[index];
            rate = rate + this.tagInTags(tag,Tags);
        }
        return (rate / tags.length);
    },

    //test tag in tags
    tagInTags:function(tag,tags){
        var count = 0;

        for(var index in tags){
            var t = tags[index];
            count = count + this.tagInTag(tag,t);
        }
        return count;
    },

    //test tag1 in tag2
    tagInTag:function(tag,Tag){
        var words = tag.split(" "),
            count = 0;

        for(var index in words){
            var w = words[index];
            count = count + this.wordInTag(w,Tag);
        }
        return (count / words.length);
    },

    //test word in tag
    wordInTag:function(word,tag){
        var regex   = new RegExp('.*' + word + '.*'),
            matches = regex.exec(tag);

        if(matches){
            return matches.length;
        }
        else{
            return 0;
        }
    }
};
module.exports.Searcher = new Searcher();