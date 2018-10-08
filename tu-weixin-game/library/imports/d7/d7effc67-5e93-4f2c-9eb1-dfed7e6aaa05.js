"use strict";
cc._RF.push(module, 'd7effxnXpNPLJ6x3+1+aqoF', 'shareRedPacket');
// Script/ComponentScript/component/shareRedPacket.js

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
        redPacket: cc.Node,
        yellowPacket: cc.Node,
        packet: cc.Node,
        nameLabel: cc.Label,
        avatar: cc.Node,
        diamond_bg: cc.Node,
        diamond_rich: cc.RichText,
        get_rich: cc.RichText,
        btn_1: cc.Button,
        btn_2: cc.Button,
        btn_lingqu_state: cc.Node,
        jiqiText: cc.Label,
        inviteedCode: -1,

        moneyIcon: cc.Node
    },

    onLoad: function onLoad() {
        this.btn_1.node.on("click", this.getReward, this);
        this.btn_2.node.on("click", this.askForReward, this);
    },

    getReward: function getReward() {
        ddz.gameModel.getInviteRewardDay(this.inviteedCode);
    },

    askForReward: function askForReward() {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, ["diamondShare"]);
        ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeGetDiamondHall);
    },

    setBtnState: function setBtnState(index) {
        if (index == 1) {
            // 未领取状态
            this.redPacket.active = true;
            this.yellowPacket.active = false;
            this.btn_1.node.active = true;
            this.btn_2.node.active = false;
            this.btn_lingqu_state.active = false;
            this.jiqiText.node.active = false;

            this.diamond_bg.active = true;
            this.avatar.active = false;
        } else if (index == 2) {
            //已领取状态
            this.redPacket.active = true;
            this.yellowPacket.active = false;
            this.btn_1.node.active = false;
            this.btn_2.node.active = false;
            this.btn_lingqu_state.active = true;
            this.jiqiText.node.active = false;

            this.diamond_bg.active = false;
            this.avatar.active = true;
        } else if (index == 3) {
            //要红包状态
            this.redPacket.active = false;
            this.yellowPacket.active = true;
            this.btn_1.node.active = false;
            this.btn_2.node.active = true;
            this.btn_lingqu_state.active = false;
            this.jiqiText.node.active = false;
        } else if (index == 4) {
            //任务集满
            this.redPacket.active = false;
            this.yellowPacket.active = false;
            this.packet.active = true;
            this.btn_1.node.active = true;
            this.btn_2.node.active = false;
            this.btn_lingqu_state.active = false;
            this.jiqiText.node.active = false;
        }
    },

    setSharePeopleInfo: function setSharePeopleInfo(data) {
        if (data.userId) {
            if (data.rewardState == 0) {
                this.setBtnState(1);
                if (data.itemId && data.itemId == "item:1311") {
                    if (data.count) {
                        this.diamond_rich.string = "<img src='dda_button_diamond' height=23 width=29/><color=#ffffff> x" + data.count + "</color>";
                    }
                } else if (data.itemId && data.itemId == "user:chip") {
                    if (data.count) {
                        this.diamond_rich.string = "<img src='ddz_main_chip' height=23 width=29/><color=#ffffff> x" + data.count + "</color>";
                    }
                } else if (data.itemId && data.itemId == "user:coupon") {
                    if (data.count) {
                        // var num = data.count/100;
                        this.diamond_rich.string = "<color=#ffffff>?</color>";
                    }
                }
            } else {
                this.setBtnState(2);
                var com = this.avatar.getComponent('Avatar');
                com.setAvatarUrl(data.bindPic);
                com.hideNameDisplay();
            }
            this.inviteedCode = data.userId;
            this.nameLabel.node.active = true;
            this.nameLabel.string = data.bindName;
        } else {
            this.setBtnState(3);
            if (data.count) {
                if (data.itemId && data.itemId == "user:coupon") {
                    // var num = data.count/100;
                    this.get_rich.string = "<color=#C17C25>最高7元</color>";
                    this.moneyIcon.active = true;
                } else {
                    this.get_rich.string = "<color=#C17C25> x" + data.count + "</color>";
                    this.moneyIcon.active = false;
                }
            }
            this.nameLabel.node.active = false;
        }
    },

    setBigReward: function setBigReward(data) {
        this.setBtnState(4);
        this.nameLabel.node.active = false;
        if (data.rewardState == 1) {
            this.btn_lingqu_state.active = true;
            this.jiqiText.node.active = false;
            this.btn_1.node.active = false;
        } else if (data.rewardState == 0) {} else {
            this.jiqiText.node.active = true;
            this.btn_1.node.active = false;
            this.btn_lingqu_state.active = false;
        }
    }
});

cc._RF.pop();