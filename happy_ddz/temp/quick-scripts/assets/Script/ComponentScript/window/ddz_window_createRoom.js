(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/window/ddz_window_createRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '743bf5/861CWarngDpo0fjV', 'ddz_window_createRoom', __filename);
// Script/ComponentScript/window/ddz_window_createRoom.js

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
        backBg: {
            default: null,
            type: cc.Button
        },
        backSprite: cc.Sprite,
        createItem1: {
            default: null,
            type: cc.Node
        },
        createItem2: {
            default: null,
            type: cc.Node
        },
        createItem3: {
            default: null,
            type: cc.Node
        },
        createItem4: {
            default: null,
            type: cc.Node
        },
        createItem5: {
            default: null,
            type: cc.Node
        },
        createButton: cc.Button,

        creatItem: {
            default: null,
            type: cc.Prefab
        },
        playing: "123",
        roundCount: 6,
        modeType: 0,
        roundWindowList: []
    },
    onItemAction1: function onItemAction1() {
        var window = this.createItem1.getComponent("ddz_item_createRoom");
        if (window.playing == this.playing) {
            return;
        }
        this.playing = window.playing;
        window.setSelectedState(true);
        var window2 = this.createItem2.getComponent("ddz_item_createRoom");
        window2.setSelectedState(false);
        var window3 = this.createItem3.getComponent("ddz_item_createRoom");
        window3.setSelectedState(false);
    },
    onItemAction2: function onItemAction2() {
        var window = this.createItem2.getComponent("ddz_item_createRoom");
        if (window.playing == this.playing) {
            return;
        }
        this.playing = window.playing;
        window.setSelectedState(true);
        var window2 = this.createItem1.getComponent("ddz_item_createRoom");
        window2.setSelectedState(false);
        var window3 = this.createItem3.getComponent("ddz_item_createRoom");
        window3.setSelectedState(false);
    },
    onItemAction3: function onItemAction3() {
        var window = this.createItem3.getComponent("ddz_item_createRoom");
        if (window.playing == this.playing) {
            return;
        }
        this.playing = window.playing;
        window.setSelectedState(true);
        var window2 = this.createItem2.getComponent("ddz_item_createRoom");
        window2.setSelectedState(false);
        var window3 = this.createItem1.getComponent("ddz_item_createRoom");
        window3.setSelectedState(false);
    },
    onItemAction4: function onItemAction4() {
        var window = this.createItem4.getComponent("ddz_item_createRoom");
        if (window.count == this.modeType) {
            return;
        }
        this.modeType = window.count;
        window.setSelectedState(true);
        var window2 = this.createItem5.getComponent("ddz_item_createRoom");
        window2.setSelectedState(false);
    },
    onItemAction5: function onItemAction5() {
        var window = this.createItem5.getComponent("ddz_item_createRoom");
        if (window.count == this.modeType) {
            return;
        }
        this.modeType = window.count;
        window.setSelectedState(true);
        var window2 = this.createItem4.getComponent("ddz_item_createRoom");
        window2.setSelectedState(false);
    },

    // createPanelWithList : function () {
    //     var row = 4;
    //     var rowHeightList = [];
    //     for (var i = 0 ; i < row ; i ++){
    //         var rowHeight = 166-i*66;
    //         rowHeightList.push(rowHeight);
    //     }
    //
    //     var col = 2;
    //     var gap = (438-20*col)/col;
    //     for (var i = 0 ; i < col ; i ++) {
    //         var item = cc.instantiate(this.creatItem);
    //         item.x = gap*i - 94;
    //     }
    // },

    onCreateButton: function onCreateButton() {
        //
        // hall.LOGW("null","========"+this.roundCount+"==="+this.modeType+"==="+this.playing);
        // return;
        if (ty.TCP.connectStatus != ty.TCP.CONNECT_STATUS_OK) {
            hall.MsgBoxManager.showToast({ title: "正在登录，请稍候" });
            ddz.LOGD(null, "TCP is not ok! Please wait!");
            return;
        }
        ddz.Share.shareKeywordReplace.totalRound = this.roundCount;
        ddz.Share.shareKeywordReplace.goodCard = this.modeType == 0 ? "标准" : "炸弹";
        var playingString;
        switch (this.playing) {
            case "happy":
                playingString = "欢乐玩法";break;
            case "wild":
                playingString = "癞子玩法";break;
            default:
                playingString = "经典玩法";
        }
        ddz.Share.shareKeywordReplace.displayName = playingString;
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeFriendRoomCreateClick, []);
        // this.playEndAnimation();
        if (ddz.matchModel.getCurWaitInfo()) {
            ddz.MsgFactory.saveMatch();
        } else {
            hall.GlobalFuncs.setInLocalStorage(ddz.friendModel.CREATE_ROUND_COUNT, this.roundCount);
            hall.GlobalFuncs.setInLocalStorage(ddz.friendModel.CREATE_MODE_TYPE, this.modeType);
            hall.GlobalFuncs.setInLocalStorage(ddz.friendModel.CREATE_PLAYING_METHOD, this.playing);
            // ddz.friendModel.createFriendRoom(this.roundCount,0,"123",this.modeType);
            ddz.friendModel.createFriendRoom(this.roundCount, 0, this.playing, this.modeType);
        }
    },
    onSeeButton: function onSeeButton() {
        if (ty.TCP.connectStatus != ty.TCP.CONNECT_STATUS_OK) {
            hall.MsgBoxManager.showToast({ title: "正在登录，请稍候" });
            ddz.LOGD(null, "TCP is not ok! Please wait!");
            return;
        }
        ddz.friendModel.getHisToryInfo();
    },
    onCloseButton: function onCloseButton() {
        this.playEndAnimation();
    },
    playEndAnimation: function playEndAnimation() {
        this.completeAni();
    },
    onBlackButton: function onBlackButton() {},
    completeAni: function completeAni() {
        this.node.destroy();
    },
    onSaveMatch: function onSaveMatch() {
        // ddz.friendModel.createFriendRoom(this.roundCount,0,"123",this.modeType);
        ddz.friendModel.createFriendRoom(this.roundCount, 0, this.playing, this.modeType);
    },
    onLoad: function onLoad() {
        ty.NotificationCenter.listen(ddz.EventType.SAVE_MATCH_SUCCESS, this.onSaveMatch, this);
        var size = cc.director.getWinSize();
        this.backBg.node.setContentSize(size);

        var animation = this.getComponent(cc.Animation);
        var anim1 = animation.getAnimationState('tipsWindowNode');
        anim1.play();

        ddz.friendModel.getFriendConf();
        ty.NotificationCenter.listen(ddz.EventType.ACTION_FT_GET_CONF, this.getFriendConfigAction, this);
        ty.NotificationCenter.listen(ddz.EventType.ACTION_FT_CHANGE_ROUND_SELECT, this.changeFriendRoundConfigAction, this);

        this.roundCount = hall.GlobalFuncs.ReadNumFromLocalStorage(ddz.friendModel.CREATE_ROUND_COUNT, 6);
        this.modeType = hall.GlobalFuncs.ReadNumFromLocalStorage(ddz.friendModel.CREATE_MODE_TYPE, 0);
        this.playing = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.friendModel.CREATE_PLAYING_METHOD, '123');

        var window4, window5;
        window4 = this.createItem4.getComponent("ddz_item_createRoom");
        window5 = this.createItem5.getComponent("ddz_item_createRoom");
        if (this.modeType == 0) {
            window4.setSelectedState(true);
            window5.setSelectedState(false);
        } else {
            window4.setSelectedState(false);
            window5.setSelectedState(true);
        }

        var window1, window2, window3;
        window1 = this.createItem1.getComponent("ddz_item_createRoom");
        window2 = this.createItem2.getComponent("ddz_item_createRoom");
        window3 = this.createItem3.getComponent("ddz_item_createRoom");
        if (this.playing == '123') {
            window1.setSelectedState(true);
            window2.setSelectedState(false);
            window3.setSelectedState(false);
        } else if (this.playing == 'happy') {
            window1.setSelectedState(false);
            window2.setSelectedState(true);
            window3.setSelectedState(false);
        } else {
            window1.setSelectedState(false);
            window2.setSelectedState(false);
            window3.setSelectedState(true);
        }

        this.createButton.interactable = false;

        if (hall.AdManagerTYWX && hall.AdManagerTYWX.getAdNodeByTag("myFirstAdNode")) {
            hall.AdManagerTYWX.getAdNodeByTag("myFirstAdNode").hideAdNode();
        }

        // if (hall.sxAdManager) {
        // hall.sxAdManager.hide();
        // }
    },
    onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
        if (hall.AdManagerTYWX.getAdNodeByTag("myFirstAdNode")) {
            hall.AdManagerTYWX.getAdNodeByTag("myFirstAdNode").showAdNode();
        }
    },
    getFriendConfigAction: function getFriendConfigAction(value) {
        this.createButton.interactable = true;
        var rounds = value.rounds;
        var xList = [-98, 31, 163];
        var windowList = [];
        var haveRound = false;
        for (var i = 0; i < rounds.length; i++) {
            var window = cc.instantiate(this.creatItem);
            window.x = xList[i];
            window.y = 87;
            this.backSprite.node.addChild(window);
            var windowManager = window.getComponent("ddz_item_createRoom");
            windowManager.type = 1;
            windowManager.setRoundCount(rounds[i].nRound);
            windowList.push(windowManager);
            if (this.roundCount == rounds[i].nRound) {
                windowManager.setSelectedState(true);
                haveRound = true;
            } else {
                windowManager.setSelectedState(false);
            }
        }
        this.roundWindowList = windowList;
        if (!haveRound) {
            this.roundCount = rounds[0].nRound;
            var windowmanager = this.roundWindowList[0];
            windowmanager.setSelectedState(true);
        }
    },
    changeFriendRoundConfigAction: function changeFriendRoundConfigAction(round) {
        for (var i = 0; i < this.roundWindowList.length; i++) {
            var windowmanager = this.roundWindowList[i];
            if (windowmanager.count == round) {
                windowmanager.setSelectedState(true);
            } else {
                windowmanager.setSelectedState(false);
            }
        }
        this.roundCount = round;
    }
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // update (dt) {},
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
        //# sourceMappingURL=ddz_window_createRoom.js.map
        