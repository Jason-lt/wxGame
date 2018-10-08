

// var ddz_rewardCell = cc.instantiate(this.tipsWindow);
// this.node.addChild(ddz_rewardCell);
// var window = ddz_rewardCell.getComponent('ddz_getReward_main');
// window.setInformationWithTotalAndLoss("589.41","1259.36",
//     [["不如跳舞1","好冷啊","还黑啊","2018-05-06"],
//         ["不如跳舞2","好冷啊","还黑啊","2018-05-06"],
//         ["不如跳舞3","好冷啊","还黑啊","2018-05-06"]]);
cc.Class({
    extends: cc.Component,

    properties: {
        ddz_getRewardHistory : {
            default : null,
            type : cc.Node
        },
        ddz_Detail :{
            default : null,
            type : cc.Node
        },
        getRewardType:1,//1:提现至余额,2:公众号领奖
    },

    setInformationWithTotalAndLoss:function () {

        var couponCount = hall.ME.udataInfo.m_couponCount;
        var exchangedCoupon = hall.ME.udataInfo.m_exchangedCoupon;
        //
        var ddz_rewardHistoryS = this.ddz_getRewardHistory.getComponent('ddz_getRewardHistory');
        var lossA = hall.GlobalFuncs.getMoneyStringWithCoupons(couponCount+exchangedCoupon);
        var lossM = hall.GlobalFuncs.getMoneyStringWithCoupons(couponCount);
        ddz_rewardHistoryS.setInformationWithTotalAndLoss(lossA,lossM);

        if (couponCount==0 && exchangedCoupon==0){
            this.ddz_Detail.active = false;
        }else {
            // var window2 = this.ddz_Detail.getComponent('ddz_rewardDetail_small');
            // // window2.parentScene = this;
            // window2.setInformationWithTotalAndLoss(inforArray);
        }
    },
    setDitailList : function (inforArray,type) {
        // if(type){
        //     this.getRewardType = type;
        //     if (this.getRewardType == 1){
        //         this.ddz_getRewardHistory.active = true;
        //         this.ddz_getReward_redIcom.active = false;
        //     }else if(this.getRewardType == 2){
        //         this.ddz_getRewardHistory.active = false;
        //         this.ddz_getReward_redIcom.active = true;
        //     }
        // }
        var window2 = this.ddz_Detail.getComponent('ddz_rewardDetail_small');
        // window2.parentScene = this;
        window2.setInformationWithTotalAndLoss(inforArray);
    },

    onLoad :function() {
        if (this.getRewardType == 1){
            this.ddz_getRewardHistory.active = true;
            // this.ddz_getReward_redIcom.active = false;
        }else if(this.getRewardType == 2){
            this.ddz_getRewardHistory.active = false;
            // this.ddz_getReward_redIcom.active = true;
        }
        this.setInformationWithTotalAndLoss();

    //     this.setInformationWithTotalAndLoss("589.41","1259.36",
    // [["通关奖励","通关3次","+45.12","2018-05-06"],
    //     ["微信领奖","已入账","2.4","2018-05-07"],
    //     ["微信领奖","已入账","1.58","2018-05-08"]]);

    //     this.setInformationWithTotalAndLoss("589.41","1259.36",
    //         [["微信领奖","已入账","1.58","2018-05-08"]]);

        // this.setInformationWithTotalAndLoss("0.00","1259.36",
        //     [["微信领奖","已入账","1.58","2018-05-08"]]);
    },


    // update (dt) {},
});
