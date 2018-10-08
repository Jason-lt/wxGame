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
        moneyNode : {
            default : null,
            type : cc.Node
        },
        goldSubNode : {
            default : null,
            type : cc.Node
        },

        moneyLabel : {
            default : null,
            type : cc.Label
        },
        goldLabel : {
            default : null,
            type : cc.Label
        },

        buttonType : 0

    },

    onLoad : function() {
        // if(!ty.SystemInfo.isCheckVersion){
        //     this.moneyNode.active = true;
        //     this.goldSubNode.active = true;
        // }else {
        //     this.moneyNode.active = false;
        //     this.goldSubNode.active = false;
        // }

        this.updateMoneyLabel();
        ty.NotificationCenter.listen(scratch.EventType.UPDATE_USER_INFO,this.updateMoneyLabel,this);
    },

    updateMoneyLabel : function () {

        if(!ty.SystemInfo.isCheckVersion){
            this.moneyNode.active = true;
            this.goldSubNode.active = true;
        }else {
            this.moneyNode.active = false;
            this.goldSubNode.active = false;
        }


        var couponCount = hall.ME.udataInfo.m_coupon;
        var lossMoneyString;
        if(!couponCount){
            lossMoneyString = "0.00";
        }else {
            lossMoneyString = hall.GlobalFuncs.getMoneyStringWithCoupons(couponCount);
        }
        this.moneyLabel.string = lossMoneyString;

        this.goldLabel.string = hall.GlobalFuncs.getChipStringWithChipCountForBottom(hall.ME.udataInfo.m_chip);
        // this.goldLabel.string = hall.GlobalFuncs.getChipStringWithChipCountForBottom(1000000000);
    },

    moneyAction : function () {
        // ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["withDraw"]);
        if(this.buttonType){
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["withDraw"]);
            scratch.GlobalFuncs.showWithDraw();

            // //TODO:TEST
            // var temp = {
            //     "sharePicUrl":"https://nslyqn.nalrer.cn/nsly/guaguale/share/5.png",
            //     "shareContent":"我玩这个游戏赚了tixianrmb元，快来一起赚！",
            //     "sharePointId":"652",
            //     "shareSchemeId":"10511210",
            //     "extraAdd":[
            //         {
            //             "type":"text",
            //             "textInformation":{
            //                 "textformatString":"tixianrmb",
            //                 "originPointX":215,
            //                 "originPointY":215,
            //                 "textColorRGB":"000000",
            //                 "fontSize":58,
            //                 "textAlign":"center"
            //             }
            //         }
            //     ],
            //     "weight":10
            // };
            // scratch.Share.shareWithType(scratch.Share.onShareType.tixianRMBshare,null,null,temp);
        }
    },

    goldCoinAction : function () {
        if(this.buttonType){
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["exchange"]);
            if(!ty.SystemInfo.isCheckVersion){
                scratch.GlobalFuncs.showChangeMain();
            }
        }
    },

    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
    }

    // LIFE-CYCLE CALLBACKS:



    // start () {
    //
    // },

    // update (dt) {},
});
