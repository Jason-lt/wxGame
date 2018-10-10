(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/hall/HallGameWorld.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2387beqrhNObqMzJkIAcEY6', 'HallGameWorld', __filename);
// Script/hall/HallGameWorld.js

'use strict';

var TodoTaskVec = require('TodoTaskVec');

cc.Class({

    ctor: function ctor() {
        this._TAG = 'hall.GameWorld';
        this.model = {};
        this.normal = {};
    },
    // 默认的析构函数
    destroy: function destroy() {
        this.model = null;
        this.normal = null;
        hall.LOGD(this._TAG, "destroy in hall._GameWorld");
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
        //# sourceMappingURL=HallGameWorld.js.map
        