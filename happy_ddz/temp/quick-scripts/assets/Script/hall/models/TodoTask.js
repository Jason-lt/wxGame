(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/hall/models/TodoTask.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'eb8764A7DxBIISckj4vdJyJ', 'TodoTask', __filename);
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
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=TodoTask.js.map
        