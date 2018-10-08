(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ddz/models/QuickStartModel.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '31188FSS85F4oZwMemQ3zl8', 'QuickStartModel', __filename);
// Script/ddz/models/QuickStartModel.js

'use strict';

/**
 * Created by tuyoo on 2018/2/4.
 */
ddz.quickStartModel = {
    cache: null,
    _mixId: null,
    _roomId: null,
    parse: function parse(value) {
        this.cache = value.result;
        if (this.cache.hasOwnProperty('mixId')) {
            this._mixId = this.cache['mixId'];
        }
        if (this.cache.hasOwnProperty('roomId')) {
            this._roomId = this.cache['roomId'];
        }
        ty.NotificationCenter.trigger(ddz.EventType.RECIVE_QUICK_START, value.result);
    },

    getMixId: function getMixId() {
        return this._mixId;
    },
    getRoomId: function getRoomId() {
        return this._roomId;
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
        //# sourceMappingURL=QuickStartModel.js.map
        