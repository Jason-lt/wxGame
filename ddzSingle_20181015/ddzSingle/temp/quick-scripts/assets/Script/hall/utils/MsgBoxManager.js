(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/hall/utils/MsgBoxManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'e8299Pf1bFB1ois/+uajAgc', 'MsgBoxManager', __filename);
// Script/hall/utils/MsgBoxManager.js

"use strict";

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
        if (ddz.toastNode) {
            ddz.toastNode.closeAction();
        }
        var preFabPath = "prefabs/ddz_toast_cell";
        cc.loader.loadRes(preFabPath, function (err, prefab) {
            var prefabNode = cc.instantiate(prefab);
            cc.director.getScene().addChild(prefabNode, 888888);
            ddz.GlobalFuncs.setToCenter(prefabNode);

            ddz.toastNode = prefabNode.getComponent("ddz_toast_cell");
            ddz.toastNode.setTitleWithString(msg.title);
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
        