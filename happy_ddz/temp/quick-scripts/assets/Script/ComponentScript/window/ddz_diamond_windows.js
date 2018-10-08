(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/window/ddz_diamond_windows.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '6e3a9dOPmFK44l7bdrY1dF8', 'ddz_diamond_windows', __filename);
// Script/ComponentScript/window/ddz_diamond_windows.js

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
        banner: cc.Node,
        betRich: cc.RichText,
        shareRedPacket: cc.Prefab,
        panel: cc.Node,
        btnText: cc.RichText,

        btnSpriteFrame: [cc.SpriteFrame],
        shareBtn: cc.Button

    },

    onLoad: function onLoad() {
        var that = this;
        // this.scheduleOnce(function () {
        //     var ani = that.banner.getComponent(cc.Animation);
        //     ani.play('btnTick');
        // }, 1);

        hall.GlobalFuncs.btnScaleEffect(this.shareBtn.node, 1.13);
        this.betRich.node.active = false;
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
        ty.NotificationCenter.listen(ddz.EventType.REMOVE_WINDOW_ANI, this.onClose, this);

        var _shareType = ddz.Share.onShareType.clickStatShareTypeGetDiamondHall;
        this.btnText.string = "<color=#E54D42>" + hall.GlobalFuncs.getButtonTitle(_shareType) + "</c>";
        // ddz.gameModel.queryWatchVideoReward();
        this.canPlayVideo = true;
    },

    playAnimationAfterShareWithType: function playAnimationAfterShareWithType(type) {
        if (type && type != ddz.Share.onShareType.clickStatShareTypeGetDiamondHall) {
            return;
        }
        var reultType = ddz.Share.resultType;
        switch (reultType) {
            case 1:
                if (!ddz.gameModel.isBringVersion) {
                    hall.MsgBoxManager.showToast({ title: '请分享到微信群哦~' });
                }
                break;
            case 2:
                if (!ddz.gameModel.isBringVersion) {
                    hall.MsgBoxManager.showToast({ title: '请不要频繁分享到一个群~' });
                }
                break;
            case 3:

                break;
            default:
                break;
        }

        ddz.Share.resultType = 0;
    },

    updateWindowInfo: function updateWindowInfo(state) {
        if (hall.AdManagerTYWX && hall.AdManagerTYWX.getAdNodeByTag("myFirstAdNode")) {
            hall.AdManagerTYWX.getAdNodeByTag("myFirstAdNode").hideAdNode();
        }
    },

    onShareBtn: function onShareBtn() {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, ["diamondShare"]);
        ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeGetDiamondHall);
    },

    onClcikSeeVideoBtn: function onClcikSeeVideoBtn() {
        if (ty.TCP.connectStatus != ty.TCP.CONNECT_STATUS_OK) {
            hall.MsgBoxManager.showToast({ title: "正在登录，请稍候" });
            ddz.LOGD(null, "TCP is not ok! Please wait!");
            return;
        }

        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, ["watchVideo", "diamond"]);

        if (this.canPlayVideo) {
            hall.adManager.showRewardedVideo(this.adId, "diamond");
        } else {
            if (this.mail) {
                hall.MsgBoxManager.showToast({ title: this.mail });
            }
        }
    },

    onClickDiamondBtn: function onClickDiamondBtn() {
        this.updateWindowInfo(1);
    },

    onClickVideoBtn: function onClickVideoBtn() {
        this.updateWindowInfo(2);
    },

    updateShareInfo: function updateShareInfo(data) {
        if (data.newUserMulti) {
            this.setBtnRichText(data.newUserMulti);
        }
        ty.NotificationCenter.trigger(ddz.EventType.UPDATE_REWARD_COUNT, data);
        if (data.inviteeList && data.inviteeList.length > 0) {
            var that = this;
            var _index = 0;
            var _inviteeList = data.inviteeList;
            var runOneFun = function runOneFun() {

                if (_index < 5) {
                    if (_inviteeList.length > 0) {
                        var _playerData = _inviteeList.shift();
                        if (that["shareRedPacket_" + _index]) {
                            var com = that["shareRedPacket_" + _index].getComponent('shareRedPacket');
                            com.setSharePeopleInfo(_playerData);
                        } else {
                            that["shareRedPacket_" + _index] = cc.instantiate(that.shareRedPacket);

                            that.panel.addChild(that["shareRedPacket_" + _index]);
                            var com = that["shareRedPacket_" + _index].getComponent('shareRedPacket');
                            com.setSharePeopleInfo(_playerData);
                        }
                    }
                } else if (_index == 5) {
                    if (data.bigReward) {
                        if (that.bigWindow) {
                            var com = that.bigWindow.getComponent('shareRedPacket');
                            if (com) {
                                com.setBigReward(data.bigReward);
                            }
                        } else {
                            that.bigWindow = cc.instantiate(that.shareRedPacket);
                            that.panel.addChild(that.bigWindow);
                            var com = that.bigWindow.getComponent('shareRedPacket');
                            com.setBigReward(data.bigReward);
                        }
                    }
                }
                _index++;
                requestAnimationFrame(runOneFun);
            };
            runOneFun();
        }
    },

    setBtnRichText: function setBtnRichText(_bet) {
        if (_bet > 0) {
            this.betRich.node.active = true;
            this.betRich.string = "<color=#9C7343>新玩家点击，可获得</c><color=#ED4824><size=30>" + _bet + "倍奖励</color>";
        }
    },

    removeLoopAni: function removeLoopAni() {
        var ani = this.banner.getComponent(cc.Animation);
        ani.stop();
        this.shareBtn.node.stopAllActions();
    },

    shut: function shut() {
        this.removeLoopAni();
        this.node.destroy();
    },

    onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
        if (hall.AdManagerTYWX.getAdNodeByTag("myFirstAdNode")) {
            hall.AdManagerTYWX.getAdNodeByTag("myFirstAdNode").showAdNode();
        }
    },

    onClose: function onClose() {
        this.shut();
        ddz.ddz_dayWelfare = null;
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
        //# sourceMappingURL=ddz_diamond_windows.js.map
        