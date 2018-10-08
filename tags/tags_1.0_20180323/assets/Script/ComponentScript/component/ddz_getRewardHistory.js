
// var ddz_rewardCell = cc.instantiate(this.tipsWindow);
// this.node.addChild(ddz_rewardCell);
// var window = ddz_rewardCell.getComponent('ddz_getRewardHistory');
// window.setInformationWithTotalAndLoss("589.41","1259.36");
cc.Class({
    extends: cc.Component,

    properties: {
        titleLabel : {
            default : null,
            type : cc.Label
        },
        numberLabel : {
            default : null,
            type : cc.Label
        },
        // getRewardButton : {
        //     default : null,
        //     type : cc.Button
        // },
        lossMoney : {
            default : null,
            type : cc.RichText
        },

    },

    setInformationWithTotalAndLoss:function () {

        var couponCount = hall.ME.udataInfo.m_couponCount;
        var exchangedCoupon = hall.ME.udataInfo.m_exchangedCoupon;

        this.numberLabel.string = (couponCount+exchangedCoupon)/100+"";
        var richString = "<color=#96ffeb>奖励余额（元）：</c><color=#ffffff>"+couponCount/100+"</color>";
        this.lossMoney.string = richString;

        // this.getRewardButton.node.on("click",this.onRewardButton,this)
    },
    // onRewardButton : function () {
    //     ddz.LOGD(null, "onRewardButton");
    // }

    // LIFE-CYCLE CALLBACKS:

    onLoad :function () {
        this.setInformationWithTotalAndLoss();
    } ,

    // update (dt) {},
});
