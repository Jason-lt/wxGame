(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/hall/utils/BuyCenter.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '0176alBEN1HCa/drM3HqxDg', 'BuyCenter', __filename);
// Script/hall/utils/BuyCenter.js

"use strict";

cc.Class({

    ctor: function ctor() {
        this._TAG = 'hall.BuyCenter';
        hall.LOGD(this._TAG, " in ctor");

        // 注册支付回调
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_PAY_FAIL, this.onBuyFailed, this);
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_PAY_SUCCESS, this.onBuySuccess, this);
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_PAY_CANCEL, this.onBuyCancel, this);

        // ty.NotificationCenter.listen(ty.EventType.MSG_BUY_COIN_FAIL, this._onBuyCoinFailed, this);
        // ty.NotificationCenter.listen(ty.EventType.MSG_BUY_COIN_SUCCESS, this._onBuyCoinSuccess, this);
    },

    // 默认的析构函数
    destroy: function destroy() {

        hall.LOGD(this._TAG, " destroy");
        ty.NotificationCenter.ignore(ddz.EventType.UPDATE_PAY_FAIL, this.onBuyFailed, this);
        ty.NotificationCenter.ignore(ddz.EventType.UPDATE_PAY_SUCCESS, this.onBuySuccess, this);
        ty.NotificationCenter.ignore(ddz.EventType.UPDATE_PAY_CANCEL, this.onBuyCancel, this);

        // ty.NotificationCenter.ignore(ty.EventType.MSG_BUY_COIN_FAIL, this._onBuyCoinFailed, this);
        // ty.NotificationCenter.ignore(ty.EventType.MSG_BUY_COIN_SUCCESS, this._onBuyCoinSuccess, this);
    },

    _onBuyCoinFailed: function _onBuyCoinFailed() {
        hall.LOGW(this._TAG, "buy coin failed from server........");
        //test
        // hall.gameWorld.firstChargeItem = null;
        // ty.NotificationCenter.trigger(hall.EventType.HALL_FIRSTCHARGE);
        this.onBuyFailed();
    },

    _onBuyCoinSuccess: function _onBuyCoinSuccess() {
        hall.LOGD(this._TAG, "buy coin success from server........");
    },

    /**
     * 购买成功回调
     * @param param
     */
    onBuySuccess: function onBuySuccess(params) {
        // this.isDoOrder = false;
        // ty.NotificationCenter.trigger(ddz.EventType.BUY_MSG_BACK);
        // if (typeof(params[0]) != 'undefined' && typeof(params[0]["result"]) != 'undefined') {
        //     var result = params[0]["result"];
        //     var tipstr = "你购买的" + result["prodName"] + "已经到账";
        //     var config = {
        //         "bgColor": cc.color.BLACK,
        //         "isCenter": true
        //     };
        //     h5.ToastLayer.create(tipstr, config);
        // }
        // hall.gameWorld.firstChargeItem = null;
        // ty.NotificationCenter.trigger(hall.EventType.HALL_FIRSTCHARGE);
        // // 从服务器获取最新的UserInfo
        // hall.MsgFactory.getUserInfo(hall.AccountInfo.userID, hall.AccountInfo.authorCode, ddz.GameId, hall.AccountInfo.clientId);

        var result = params["result"];
        hall.LOGW("", "file = [ByCenter] fun = [onBuySuccess] result = " + JSON.stringify(result));
        ty.NotificationCenter.trigger(ddz.EventType.CONVERSION_SUCCESS, result["prodName"]);
        var tips = "兑换成功";
        var str = "<img src='ddz_coin_white'/><color=#FFFFFF> " + result["prodName"] + "</c>";
        ddz.GlobalFuncs.playShareZuanShi(result["prodName"], tips, str);
    },

    /**
     * 购买失败回调
     * @param param
     */
    onBuyFailed: function onBuyFailed(param) {
        //this.isDoOrder = false;
        //hall.LOGD(this._TAG, 'Buy Failed Product ' - JSON.stringify(this.model.productObj.name));
        ty.NotificationCenter.trigger(ddz.EventType.BUY_MSG_BACK);
    },

    /**
     * 取消购买回调
     * @param param
     */
    onBuyCancel: function onBuyCancel(param) {
        //this.isDoOrder = false;
        //hall.LOGD(this._TAG, 'Buy Cancel Product ' - JSON.stringify(this.model.productObj.name));
        h5.globalFunc.removeLoadingLayer();
        h5.ToastLayer.create("取消支付");
        ty.NotificationCenter.trigger(ddz.EventType.BUY_MSG_BACK);
    },

    /**
     * productId - 商品ID
     * productName - 商品名称
     * buyType - 购买方式 charge - 充值；consume - 消费； direct - 直冲
     * price - 购买方式为charge和direct时，为人民币；consume为钻石
     * 特殊说明
     * 1）   购买钻石，price为人民币
     *       直冲和消费钻石，price为钻石
     * 2）   钻石换金币，count值有意义，其他时候count为1即可
     */
    runPayOrder: function runPayOrder(productId, productName, count, price, buyType) {
        hall.LOGD(this._TAG, " run runPayOrder-----------------------ID:" + productId + "--ProductName:" + productName + "price = " + price + " buytype = " + buyType);
        if (buyType == "charge") {
            // 购买钻石
            h5.MainInterface.payDiamond(productId, count, productName, price, ddz.GameId, false);
        } else if (buyType == "consume") {
            // 消费钻石
            h5.MainInterface.consumeDiamond(productId, productName, count, price, ddz.GameId);
        } else if (buyType == "direct") {
            h5.MainInterface.buyCoinDirect(productId, productName, count, price, ddz.GameId);
        }
    },

    runPayOrderByParam: function runPayOrderByParam(param) {

        if (typeof param['productId'] != 'undefined' && param['productId'] != null && typeof param['productName'] != 'undefined' && param['productName'] != null && typeof param['count'] != 'undefined' && param['count'] != null && typeof param['price'] != 'undefined' && param['price'] != null && typeof param['buyType'] != 'undefined' && param['buyType'] != null) {
            this.runPayOrder(param['productId'], param['productName'], param['count'], param['price_diamond'], param['buyType']);
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
        //# sourceMappingURL=BuyCenter.js.map
        