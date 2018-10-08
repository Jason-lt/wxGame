(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/hall/utils/MsgBoxManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'cdd50Rmz4lP96uTPu+uP/nZ', 'MsgBoxManager', __filename);
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
        if (shot.msgBoxNode) {
            shot.msgBoxNode.closeAction();
            shot.msgBoxNode = null;
        }
        var preFabPath = "shot_prefabs/shot_toast_tips";
        cc.loader.loadRes(preFabPath, function (err, prefab) {
            var prefabNode = cc.instantiate(prefab);
            cc.director.getScene().addChild(prefabNode);
            shot.GlobalFuncs.setToCenter(prefabNode);
            if (!msg.hasOwnProperty('icon')) {
                msg.icon = 'none';
            }
            shot.msgBoxNode = prefabNode.getComponent('shot_toast_tips');
            shot.msgBoxNode.setTitleWithString(msg.title);
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
        