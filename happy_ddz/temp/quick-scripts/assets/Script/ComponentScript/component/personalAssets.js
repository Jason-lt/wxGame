(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/component/personalAssets.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '649e0BdnBxEjaMC3IWVCPGf', 'personalAssets', __filename);
// Script/ComponentScript/component/personalAssets.js

"use strict";

// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        coinLabel: {
            default: null,
            type: cc.Label
        },
        diamondLabel: {
            default: null,
            type: cc.Label
        },
        jiPaiQiLabel: {
            default: null,
            type: cc.Label
        }
    },

    onLoad: function onLoad() {
        this.diamondLabel.string = hall.ME.udataInfo.diamondCount + "";
        // this.jiPaiQiLabel.string = hall.ME.udataInfo.jiPaiQiCount+"";
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_DIAMOND_NUMBER, this.updateDiamond, this);
        this.updateCoin();
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_COIN_NUMBER, this.updateCoin, this);
        // ty.NotificationCenter.listen(ddz.EventType.UPDATE_JIPAIQI,this.updateJiPaiQi,this);
    },

    updateInfo: function updateInfo() {
        this.updateCoin();
        var num = hall.ME.udataInfo.diamondCount;
        this.updateDiamond(num);
    },

    updateCoin: function updateCoin() {
        var number = hall.ME.getChip();
        // hall.LOGD("","file = [personalAssets] fun = [updateCoin] number = " + number);
        if (number) {
            this.coinLabel.string = hall.GlobalFuncs.formatGold(number);
        } else {
            this.coinLabel.string = 0;
        }
    },

    updateJiPaiQi: function updateJiPaiQi() {
        // this.jiPaiQiLabel.string = hall.ME.udataInfo.jiPaiQiCount+"";
    },

    updateDiamond: function updateDiamond(num) {
        if (num) {
            this.diamondLabel.string = hall.GlobalFuncs.formatGold(num);
        } else {
            this.diamondLabel.string = 0;
        }
    },

    // 点击金币
    onClickCoin: function onClickCoin() {
        ty.NotificationCenter.trigger(ddz.EventType.REMOVE_WINDOW_ANI);
        var curScene = cc.director.getScene();
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, ["chipAdd", curScene.name]);
        hall.GlobalFuncs.gotoMallScene();
    },

    // 点击钻石
    onClickDiamond: function onClickDiamond() {
        // var curScene = cc.director.getScene();
        // ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["diamondAdd",curScene.name]);
        // // hall.GlobalFuncs.showDiamondWindowWithType('new');
        // // ddz.gameModel.queryNewInviteInfo();
        // ddz.isClickShareReward = true;
        // ddz.gameModel.getDayInviteReward();
        ty.NotificationCenter.trigger(ddz.EventType.REMOVE_WINDOW_ANI);
        var curScene = cc.director.getScene();
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, ["assetsClickRecharge", curScene.name]);
        hall.GlobalFuncs.gotoRechargeScene();
    },

    // 点击记牌器
    onClickJiPaiQi: function onClickJiPaiQi() {},

    onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
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
        //# sourceMappingURL=personalAssets.js.map
        