"use strict";
cc._RF.push(module, 'd0c02tCHAxFF5GGRaAxZO+P', 'TodoTask');
// Script/hall/models/TodoTask.js

"use strict";

/**
 * Created by tuyoo on 2018/2/1.
 */
hall.TodoTask = cc.Class({

    ctor: function ctor() {
        this["action"] = "";
        this["params"] = {};
    },

    destroy: function destroy() {},

    parseTask: function parseTask(json) {
        if (typeof json['action'] != 'undefined') {
            this["action"] = json['action'];
        }
        if (typeof json['params'] != 'undefined') {
            this["params"] = json['params'];
        }
    }
});

cc._RF.pop();