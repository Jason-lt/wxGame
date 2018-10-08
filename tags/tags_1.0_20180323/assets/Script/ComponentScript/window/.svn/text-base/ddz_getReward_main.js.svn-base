

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
        }

    },

    setInformationWithTotalAndLoss:function () {

        var couponCount = hall.ME.udataInfo.m_couponCount;
        var exchangedCoupon = hall.ME.udataInfo.m_exchangedCoupon;
        //
        // var ddz_rewardHistoryS = this.ddz_getRewardHistory.getComponent('ddz_getRewardHistory');
        // ddz_rewardHistoryS.setInformationWithTotalAndLoss((couponCount+exchangedCoupon)/100+"",couponCount/100+"");

        if (couponCount==0 && exchangedCoupon==0){
            this.ddz_Detail.active = false;
        }else {
            // var window2 = this.ddz_Detail.getComponent('ddz_rewardDetail_small');
            // // window2.parentScene = this;
            // window2.setInformationWithTotalAndLoss(inforArray);
        }
    },
    setDitailList : function (inforArray) {
        var window2 = this.ddz_Detail.getComponent('ddz_rewardDetail_small');
        // window2.parentScene = this;
        window2.setInformationWithTotalAndLoss(inforArray);
    },


    onLoad :function() {
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
