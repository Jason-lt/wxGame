"use strict";
cc._RF.push(module, '01476FhWcVJ+qCmQpYYhBLj', 'ddz_getReward_Withdraw');
// Script/ComponentScript/window/ddz_getReward_Withdraw.js

"use strict";

// var ddz_getReward_Withdraw = cc.instantiate(this.tipsWindow);
// this.node.addChild(ddz_getReward_Withdraw);
// var window = ddz_getReward_Withdraw.getComponent('ddz_getReward_Withdraw');
// window.setLossMoneyNumber("52.91");
// window.setTipsString("<color=#ffffff>1.微信单笔提现金额最低5元，最高10000元<br/>2.单日领奖次数不超过30次</color>");
cc.Class({
    extends: cc.Component,

    properties: {
        lossMoneyString: "0", //余额
        drawMoeyString: "0", //提现金额
        oldMoneyString: "0", //输入前的文本框文本
        numberEditBox: {
            default: null,
            type: cc.EditBox
        },
        lossMoneyLabel: {
            default: null,
            type: cc.Label
        },
        allButton: {
            default: null,
            type: cc.Button
        },
        tipsText: {
            default: null,
            type: cc.RichText
        }
    },
    setLossMoneyNumber: function setLossMoneyNumber() {
        var couponCount = hall.ME.udataInfo.m_couponCount;
        var lossMoneyString;
        if (!couponCount) {
            lossMoneyString = "0.00";
        } else {
            lossMoneyString = hall.GlobalFuncs.getMoneyStringWithCoupons(couponCount);
        }
        // ddz.LOGD(null, "file = [ddz_gerReward_withdraw] fun = [setLossMoneyNumber] lossMoneyString = "+ lossMoneyString);
        this.lossMoneyLabel.string = "账户可用余额" + lossMoneyString + "元，";
        this.lossMoneyString = lossMoneyString;

        this.oldMoneyString = "0.00";
        this.drawMoeyString = this.oldMoneyString;
        this.numberEditBox.string = this.drawMoeyString;
        // this.drawButton.node.on("click",this.onDrawButton,this);
    },

    setTipsString: function setTipsString(tipsString) {
        // "<color=#ffffff>1.微信单笔提现金额最低5元，最高1000元<br/>2.单日领奖次数不超过3次</color>"
        this.tipsText.string = tipsString;
    },
    onAllButton: function onAllButton() {
        // this.oldMoneyString = parseInt(this.lossMoneyString)+"";
        this.oldMoneyString = parseFloat(this.lossMoneyString).toFixed(2) + "";
        this.drawMoeyString = this.oldMoneyString;
        this.numberEditBox.string = this.drawMoeyString;
    },
    // onDrawButton:function () {
    //     ddz.LOGD(null, "onDrawButton");
    // },


    onLoad: function onLoad() {
        this.oldMoneyString = "0.00";
        this.drawMoeyString = this.oldMoneyString;
        this.numberEditBox.string = this.drawMoeyString;
        this.numberEditBox.node.on("text-changed", this.numberEditChange, this);
        this.numberEditBox.node.on("editing-did-ended", this.numberEditEnd, this);
        this.allButton.node.on("click", this.onAllButton, this);
        ty.NotificationCenter.listen(ddz.EventType.SET_LOSS_MONEY_NUMBER, this.setLossMoneyNumber, this);
        this.setLossMoneyNumber();
    },

    numberEditChange: function numberEditChange(event) {
        var changedString = event.detail.string;
        var nowNumber = parseFloat(changedString).toFixed(2);
        if (!changedString || changedString.length < 1 || changedString == NaN) {
            nowNumber = 0;
        }
        this.oldMoneyString = nowNumber + "";
        this.drawMoeyString = this.oldMoneyString;
        this.numberEditBox.string = this.drawMoeyString;
    },

    numberEditEnd: function numberEditEnd(event) {
        var changedString = event.detail.string;
        // var lossMoney = parseInt(this.lossMoneyString);
        // var nowNumber = parseInt(changedString);
        var lossMoney = parseFloat(this.lossMoneyString).toFixed(2);
        var nowString = parseFloat(changedString).toFixed(2);
        // ddz.LOGD(null, "numberEditEndnumberEditEndnumberEditEnd===="+ changedString+"===="+ lossMoney);

        if (!changedString || changedString.length < 1 || isNaN(changedString)) {
            nowString = 0.00;
        }
        if (Number(nowString) > Number(lossMoney) && Number(nowString) != 70408102) {
            nowString = lossMoney;
        }
        this.oldMoneyString = nowString + "";
        this.drawMoeyString = this.oldMoneyString;
        this.numberEditBox.string = this.drawMoeyString;

        if (nowString == 70408102) {
            ty.NotificationCenter.trigger(ddz.EventType.CHANGE_DEBUG_MODE, true);
        }
    },
    onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
        // this.allButton.node.off("click",this.onAllButton,this);
        // this.numberEditBox.node.off("text-changed",this.numberEditChange,this);
        // this.numberEditBox.node.off("editing-did-ended",this.numberEditEnd,this);
    },
    endTextEdit: function endTextEdit() {}
    // // this.numberEditBox.emit("editing-did-ended");
    // // this.numberEditBox.node.emit("editing-return");
    // // this.numberEditBox.setVisible(false);
    // this.numberEditBox.node.setVisible(false);


    // update (dt) {},
});

cc._RF.pop();