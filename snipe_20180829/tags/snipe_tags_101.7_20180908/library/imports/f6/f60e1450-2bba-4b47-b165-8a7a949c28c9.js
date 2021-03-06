"use strict";
cc._RF.push(module, 'f60e1RQK7pLR7FlinqUnCjJ', 'debugNode');
// Script/ComponentScript/window/debugNode.js

"use strict";

// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        numberEditBox: {
            default: null,
            type: cc.EditBox
        },
        txtShareType: cc.EditBox,
        txtShareSchemeId: cc.EditBox,
        userIdlabel: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onBlack: function onBlack() {},
    onLoad: function onLoad() {
        hall.GlobalFuncs.setInLocalStorage(shot.gameModel.DEBUG_MODE, true);
        this.numberEditBox.node.on("text-changed", this.numberEditChange, this);
        this.numberEditBox.node.on("editing-did-ended", this.numberEditEnd, this);
        this.numberEditBox.string = "0";

        this.userIdlabel.string = "userId  :   " + ty.UserInfo.userId;

        // ty.NotificationCenter.listen(ty.EventType.GET_SHARE_SINGLE_CONFIG_SUCCESS, this.onShowShareWin, this);
    },
    numberEditChange: function numberEditChange(event) {
        // var changedString = event.detail.string;
        this.numberEditBox.string = event.detail.string;
    },

    numberEditEnd: function numberEditEnd(event) {
        var changedString = event.detail.string;
        this.numberEditBox.string = changedString;
        if (changedString == '20180706') {
            hall.GlobalFuncs.setInLocalStorage(shot.gameModel.DEBUG_MODE, false);
            this.node.destroy();
            return;
        }
        if (changedString == '20180707') {
            this.node.destroy();
        }
    },

    updateScoreCloud: function updateScoreCloud() {
        shot.GameWorld.totalScore = this.numberEditBox.string;
        shot.GlobalFuncs.upDateRankData(shot.GameWorld.totalScore);
    },

    changeInitScore: function changeInitScore() {
        shot.GameWorld.initGameLevel = parseInt(this.numberEditBox.string);
        // shot.gameModel.initScore = parseInt(this.numberEditBox.string);
    },

    changeServerUrl: function changeServerUrl() {
        var type = parseInt(this.numberEditBox.string);
        switch (type) {
            case 1:
                {
                    hall.GlobalFuncs.setInLocalStorage(ty.SystemInfo.DEBUG_SER_KEY, "http://192.168.20.108:8000/");
                    break;
                }
            case 2:
                {
                    hall.GlobalFuncs.setInLocalStorage(ty.SystemInfo.DEBUG_SER_KEY, "https://fz.nalrer.cn/");
                    break;
                }
            case 3:
                {
                    hall.GlobalFuncs.setInLocalStorage(ty.SystemInfo.DEBUG_SER_KEY, "https://openrich.nalrer.cn/");
                    break;
                }
            default:
                break;
        }
    },

    onUserLaser: function onUserLaser() {
        shot.GameWorld.canUserLaser = true;
    },
    // testWithString : function () {
    //     // this.mainScene
    //     this.userIdlabel.string = "userId  :   "+ ty.UserInfo.userId;
    //     //
    //     // var sceneInfo = wx.getLaunchOptionsSync();
    //     // this.onLaunchParamsLabel.string = "Launch：  "+JSON.stringify(sceneInfo);
    //     //
    //     // var onShowString = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.gameModel.ONSHOW_PARAMS,"");
    //     // this.onShowParamsLabel.string = "onShow :  " + onShowString;
    // },
    // onTestSingleShare:function () {
    //     //测试单个未上线的配置信息
    //     var shareType = this.txtShareType.string;
    //     var shareSchemeId = this.txtShareSchemeId.string;
    //
    //     var obj = {
    //         "share_type" : shareType,
    //         "config_id" : shareSchemeId
    //     };
    //
    //     ty.PropagateInterface.getSingleShareConfigInfo(obj);
    // },
    // onShowShareWin:function (obj) {
    //     // this.onLaunchParamsLabel.string = JSON.stringify(obj);
    //     var shareCfg = obj[this.txtShareType.string][0];
    //     shot.Share.shareWithType(this.txtShareType.string, null, null, shareCfg);
    // },

    onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
    }

    // update (dt) {},
});

cc._RF.pop();