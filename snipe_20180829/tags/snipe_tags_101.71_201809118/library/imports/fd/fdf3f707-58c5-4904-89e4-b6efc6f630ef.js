"use strict";
cc._RF.push(module, 'fdf3fcHWMVJBInktu/G9jDv', 'shot_diamond');
// Script/ComponentScript/window/shot_diamond.js

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
        diamondContentNode: cc.Node,
        haveFriendNode: cc.Node,
        nameLabel: {
            default: null,
            type: cc.Label
        },

        countLabel: {
            default: null,
            type: cc.Label
        },

        descLabel: cc.Label,

        buttonTitleLabel: {
            default: null,
            type: cc.RichText
        },

        state: 0,
        inviteButton: cc.Button
    },
    onCloseButton: function onCloseButton() {
        this.inviteButton.node.stopAllActions();
        this.node.destroy();
    },
    onInviteAction: function onInviteAction() {
        if (this.state == 0) {
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, ["diamondInvitation"]);
            shot.Share.shareWithType(shot.Share.onShareType.clickStatShareTypeDiamond);
            // var _config = shot.GameWorld.gunnerShareSchemeConfig;
            // if (_config && _config.resurgenceShare){
            //     shot.Share.shareWithType(shot.Share.onShareType.clickStatShareTypeRevial);
            // }else {
            //     shot.Share.shareWithType(shot.Share.onShareType.clickStatShareTypeDiamond);
            // }
            //
        } else {
            this.onCloseButton();
        }
    },
    // LIFE-CYCLE CALLBACKS:

    onBlack: function onBlack() {},

    onLoad: function onLoad() {
        hall.GlobalFuncs.btnScaleEffect(this.inviteButton.node, 1.13);
        ty.NotificationCenter.listen(shot.EventType.UPDATE_DIAMOND_NUMBER, this.updateDiamond, this);
        this.updateDiamond();
        this.state = 0;
    },

    changeStateWithInfo: function changeStateWithInfo(state, result) {
        this.state = state;
        if (state == 0) {
            // shot.gameModel.queryMutualInviteAssets();
            ty.NotificationCenter.listen(shot.EventType.UPDATE_ASSETS_COUNT, this.getAsstsCount, this);

            // this.countLabel.string = " x"+shot.gameModel.assetsCounts;
            this.diamondContentNode.active = true;
            this.haveFriendNode.active = false;
            this.buttonTitleLabel.string = "<color=#ffffff><b>邀请群友</b></color>";
            this.descLabel.string = "已有";
        } else {
            //帮助该好友获得的钻石数量
            this.diamondContentNode.active = false;
            this.haveFriendNode.active = true;
            if (result && result.counts != null) {
                this.countLabel.string = " x" + result.counts;
            }
            this.descLabel.string = "获得";
            if (result && result.name) {
                this.nameLabel.string = hall.GlobalFuncs.sliceStringToLength(result.name, 10);
            }
            this.buttonTitleLabel.string = "<color=#ffffff><b>确 定</b></color>";
        }
    },

    updateDiamond: function updateDiamond() {
        if (this.state == 0) {
            this.countLabel.string = "x" + hall.ME.udataInfo.diamondCount;
        }
    },

    getAsstsCount: function getAsstsCount(result) {
        this.countLabel.string = " x" + shot.gameModel.assetsCounts;
        this.diamondContentNode.active = true;
        this.haveFriendNode.active = false;
        this.buttonTitleLabel.string = "<color=#ffffff><b>邀请群友</b></color>";
    },
    onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }

    // update (dt) {},
});

cc._RF.pop();