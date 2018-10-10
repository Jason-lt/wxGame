(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/hall/utils/MsgBoxManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '64b7d1BVv9H2rndS2Q5PwVQ', 'MsgBoxManager', __filename);
// Script/hall/utils/MsgBoxManager.js

'use strict';

/**
 * Created by tuyoo on 2018/2/1.
 */
hall.MsgBoxManager = {
    /**
     * 显示弹出信息框
     * @param msg 例如
     * {
            title: '成功',
            icon: 'success',
            duration: 2000
        }
     */
    showToast: function showToast(msg) {
        var that = this;
        if (double.msgBoxNode) {
            double.msgBoxNode.closeAction();
            double.msgBoxNode = null;
        }
        var preFabPath = "double_prefabs/double_toast_tips";
        cc.loader.loadRes(preFabPath, function (err, prefab) {
            var prefabNode = cc.instantiate(prefab);
            cc.director.getScene().addChild(prefabNode);
            double.GlobalFuncs.setToCenter(prefabNode);
            if (!msg.hasOwnProperty('icon')) {
                msg.icon = 'none';
            }
            double.msgBoxNode = prefabNode.getComponent('double_toast_tips');
            double.msgBoxNode.setTitleWithString(msg.title, msg.time);
        });

        // wx.showToast(msg);
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
        //# sourceMappingURL=MsgBoxManager.js.map
        