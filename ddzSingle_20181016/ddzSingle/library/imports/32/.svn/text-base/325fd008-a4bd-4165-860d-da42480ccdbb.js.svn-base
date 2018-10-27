"use strict";
cc._RF.push(module, '325fdAIpL1BZYYN2kJIDM27', 'ddz_getRewardHistory');
// Script/ComponentScript/component/ddz_getRewardHistory.js

"use strict";

// var ddz_rewardCell = cc.instantiate(this.tipsWindow);
// this.node.addChild(ddz_rewardCell);
// var window = ddz_rewardCell.getComponent('ddz_getRewardHistory');
// window.setInformationWithTotalAndLoss("589.41","1259.36");
cc.Class({
    extends: cc.Component,

    properties: {
        titleLabel: {
            default: null,
            type: cc.Label
        },
        numberLabel: {
            default: null,
            type: cc.Label
        },
        getRewardType: 1, //1:提现至余额,2:公众号领奖
        // getRewardButton : {
        //     default : null,
        //     type : cc.Button
        // },
        lossMoney: {
            default: null,
            type: cc.RichText
        }

    },

    setInformationWithTotalAndLoss: function setInformationWithTotalAndLoss() {
        ddz.LOGD("", "file = [ddz_getRewardHistory] fun = [setInformationWithTotalAndLoss]");
        var couponCount = hall.ME.udataInfo.m_couponCount;
        var exchangedCoupon = hall.ME.udataInfo.m_exchangedCoupon;
        // if(this.getRewardType == 1){
        this.numberLabel.string = hall.GlobalFuncs.getMoneyStringWithCoupons(couponCount + exchangedCoupon);
        var lossMo = hall.GlobalFuncs.getMoneyStringWithCoupons(couponCount);
        var richString = "<color=#9C7343>账户可用余额：</c><color=#9C7343>" + lossMo + "</color>";
        this.lossMoney.string = richString;
        // }else if(this.getRewardType == 2){
        //     this.numberLabel.string = "x "+(couponCount+exchangedCoupon)/100;
        // }

        // this.getRewardButton.node.on("click",this.onRewardButton,this)
    },
    // onRewardButton : function () {
    //     ddz.LOGD(null, "onRewardButton");
    // }

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.setInformationWithTotalAndLoss();
    }

    // update (dt) {},
});

cc._RF.pop();