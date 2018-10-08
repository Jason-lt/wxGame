"use strict";
cc._RF.push(module, 'cf961bsO0pGS6LvN9bAejyh', 'ServerStateManager');
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