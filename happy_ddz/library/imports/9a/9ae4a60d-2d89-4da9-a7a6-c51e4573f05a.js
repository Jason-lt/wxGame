"use strict";
cc._RF.push(module, '9ae4aYNLYlNqaemxR5Fc/Ba', 'ddz_detail');
// Script/ComponentScript/Scenes/ddz_detail.js

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
        backButton: {
            default: null,
            type: cc.Button
        },
        startButton: {
            default: null,
            type: cc.Button
        },
        titleLabel: {
            default: null,
            type: cc.Label
        },
        contentRich: {
            default: null,
            type: cc.RichText
        }
    },
    backAction: function backAction() {
        ddz.LOGD(null, "backAction");
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.back_button_click_sound, false);
        this.backButton.node.active = false;
        this.startButton.node.active = false;
        var sceneName = 'Ddz';
        // cc.director.loadScene(sceneName);
        hall.GlobalFuncs.popScene();
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        if (backButtonH) {
            this.backButton.node.y = backButtonH;
        }
    },

    onTopButtonAction: function onTopButtonAction() {
        this.backButton.node.active = false;
        this.startButton.node.active = false;
        if (ty.TCP.connectStatus != ty.TCP.CONNECT_STATUS_OK) {
            hall.MsgBoxManager.showToast({ title: "正在登录，请稍候" });
            ddz.LOGD(null, "TCP is not ok! Please wait!");
            this.backButton.node.active = true;
            this.startButton.node.active = true;
            return;
        }
        ddz.matchModel.startMatchProgress();
        // ty.NotificationCenter.listen(ddz.EventType.ACTION_ENTER_TABLE,this.setActiveForFalse,this);
        this.titleLabel.node.active = false;
        this.contentRich.node.active = false;
    },
    setActiveForFalse: function setActiveForFalse() {

        this.titleLabel.node.active = false;
        this.contentRich.node.active = false;

        // this.backButton.node.active = false;
    },
    onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
    }
    // start () {
    //
    // },

    // update (dt) {},
});

cc._RF.pop();