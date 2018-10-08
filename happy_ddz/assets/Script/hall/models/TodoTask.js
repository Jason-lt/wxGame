/**
 * Created by tuyoo on 2018/2/1.
 */
hall.TodoTask = cc.Class({

    ctor: function() {
        this["action"] = "";
        this["params"] = {};
    },

    destroy: function() {},

    parseTask: function(json) {
        if (typeof(json['action']) != 'undefined') {
            this["action"] = json['action'];
        }
        if (typeof(json['params']) != 'undefined') {
            this["params"] = json['params'];
        }
    }
});
