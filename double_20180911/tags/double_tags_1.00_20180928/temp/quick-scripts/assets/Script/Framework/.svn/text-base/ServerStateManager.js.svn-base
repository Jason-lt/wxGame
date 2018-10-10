(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Framework/ServerStateManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '61371E0RzRKb5pO1SvO+9aR', 'ServerStateManager', __filename);
// Script/Framework/ServerStateManager.js

'use strict';

/**
 * Created by xujing on 2018/5/15.
 * 服务器状态检查,在登录SDK之前
 */

require('HttpUtil');

ty.ServerStateManager = {
    checkServerState: function checkServerState(callBack) {
        var header = { 'content-type': 'application/x-www-form-urlencoded' };
        var configObj = {
            'url': ty.SystemInfo.loginUrl + 'open/v4/sdk/util/gameserver/status/query',
            'header': header,
            'postData': {
                appId: ty.SystemInfo.appId
            }
        };
        // 测试post
        ty.HttpUtil.httpPost(configObj, 'POST', function (res) {
            if (res.data.result.code == 1) {
                //显示维护中的窗口
                hall.GlobalFuncs.showPopWinByPreFab('prefabs/withdrawalMaintain', function (preFabNode) {
                    var lbl = preFabNode.getChildByName('label');
                    lbl.getComponent(cc.Label).string = res.data.result.info;
                });
            } else {
                callBack();
            }
        }, function (res) {
            callBack();
        });
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
        //# sourceMappingURL=ServerStateManager.js.map
        