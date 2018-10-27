(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ddz/models/TableInfoModel.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '4b42fNb6DVNOJiUJlaceHtB', 'TableInfoModel', __filename);
// Script/ddz/models/TableInfoModel.js

"use strict";

/**
 * Created by tuyoo on 2018/2/4.
 */
ddz.tableInfoModel = {
    cache: null,
    parse: function parse(value) {
        this.cache = value.result;
        ddz.matchModel.isGameFlow = false;
        ty.NotificationCenter.trigger(ddz.EventType.RECIVE_TABLE_INFO, value.result);
    },
    clean: function clean() {
        this.cache = null;
    }
};

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
        //# sourceMappingURL=TableInfoModel.js.map
        