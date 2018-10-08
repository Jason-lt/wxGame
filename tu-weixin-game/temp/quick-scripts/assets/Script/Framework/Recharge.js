(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Framework/Recharge.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd12f4DOU/pOGIrJn9gQsegS', 'Recharge', __filename);
// Script/Framework/Recharge.js

'use strict';

/**
 * Created by tuyoo on 2018/5/7.
 */

ty.Recharge = {
    createOrder: function createOrder(id, prodPrice, name, prodCount) {
        /*
         params  id:商品ID,prodPrice:价格  单位元, name:商品名称
                 prodCount:购买数量,默认为1
          prodId:商品ID, prodName:商品名称, prodCount:购买数量
         prodPrice:价格  单位元,
         chargeType:支付方式 wxapp.iap,
         gameId:子游戏id,
         appInfo:透传参数,
         mustcharge:是否支付 默认填 1
         */
        var data = {};
        data.prodId = id;
        data.prodPrice = prodPrice;
        data.chargeType = "wxapp.iap";
        data.gameId = ty.SystemInfo.gameId || ty.SystemInfo.hallId;
        data.prodName = name;
        data.prodCount = prodCount;
        // data.gameId = ty.SystemInfo.hallId;
        data.appInfo = {};
        ty.TuyooSDK.rechargeOrder(data);
    },
    orderCallFunc: function orderCallFunc(url, platformOrderId, chargeCoin) {
        var local_uuid = hall.GlobalFuncs.getLocalUuid();
        // hall.LOGW(null, 'file = [Recharge] fun = [orderCallFunc] url = ' + url);
        // hall.LOGW(null, 'file = [Recharge] fun = [orderCallFunc] platformOrderId = ' + platformOrderId);
        var _chargeCoin = chargeCoin;
        wx.request({
            url: url,
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                userId: ty.UserInfo.userId,
                appId: ty.SystemInfo.appId,
                wxAppId: ty.SystemInfo.wxAppId,
                clientId: ty.SystemInfo.clientId,
                imei: 'null',
                uuid: local_uuid,
                platformOrderId: platformOrderId
            },

            method: 'POST',

            success: function success(results) {
                // hall.LOGW(null, 'file = [Recharge] fun = [OrderCallFun] 充值成功 results = ' + JSON.stringify(results));
                ty.NotificationCenter.trigger(ddz.EventType.CHARGE_SUCCESS, _chargeCoin);
                var tips = "购买成功";
                var str = "<img src='ddz_button_diamond'/><color=#FFFFFF> " + _chargeCoin + "</c>";
                ddz.GlobalFuncs.playShareZuanShi(_chargeCoin, tips, str);
            },
            fail: function fail(params) {
                // hall.LOGW(null, 'file = [Recharge] fun = [OrderCallFun] 充值失败 params = ' + JSON.stringify(params));
            },
            complete: function complete(params) {}
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
        //# sourceMappingURL=Recharge.js.map
        