/**
 * Created by IntelliJ IDEA.
 * User: alfredo
 * Date: 30/05/11
 * Time: 15:22
 * To change this template use File | Settings | File Templates.
 */
var Error_Manager = function(){
    var log = new Array();
    return {
        addException:function(ex){
            log[log.length] = ex;   //add date....
        }
    }
}();