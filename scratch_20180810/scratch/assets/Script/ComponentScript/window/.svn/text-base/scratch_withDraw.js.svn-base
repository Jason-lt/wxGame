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

        topNode : {
            default : null,
            type : cc.Node
        },
        bottomNode : {
            default : null,
            type : cc.Node
        },


        lossLabel : {
            default : null,
            type : cc.Label
        },
        numberEditBox : {
            default : null,
            type : cc.EditBox
        },

        drawButton : {
            default : null,
            type : cc.Button
        },
        lossMoney : 0,
        nowMoney : 0
    },

    backAction : function () {
        this.node.destroy();
    },
    onBlack : function () {

    },
    onLoad : function() {
        if(ty.UserInfo.systemType == ty.UserInfo.SYSTEMTYPE.iPhoneXType || ty.UserInfo.systemType == ty.UserInfo.SYSTEMTYPE.ANDROIDVIVO85 ){
            this.topNode.y = cc.director.getWinSize().height/2-100;
            this.bottomNode.y = -cc.director.getWinSize().height/2+70;
        }else {
            this.topNode.y = cc.director.getWinSize().height/2;
            this.bottomNode.y = -cc.director.getWinSize().height/2;
        }

        this.drawButton.enableAutoGrayEffect = true;
        this.drawButton.interactable = false;

        var couponCount = hall.ME.udataInfo.m_coupon;
        var lossMoneyString;
        if(!couponCount){
            lossMoneyString = "0.00";
        }else {
            lossMoneyString = hall.GlobalFuncs.getMoneyStringWithCoupons(couponCount);
        }

        this.lossMoney = lossMoneyString;
        this.lossLabel.string = "账户可用余额"+this.lossMoney+"元,";

        ty.NotificationCenter.listen(scratch.EventType.GET_LUCKY_CASH_INFO,this.getDrawResult,this);
    },

    allInAction : function () {

        this.drawButton.interactable = true;

        this.nowMoney = this.lossMoney;
        this.numberEditBox.string = this.nowMoney;
    },

    drawAction : function () {
        // //TODO:TEST
        if(this.nowMoney < 10){
            hall.MsgBoxManager.showToast({"title":"累计金额大于10元可提现"});
            return;
        }
        scratch.gameModel.getCashLucky(parseInt(this.nowMoney*100));
    },
    getDrawResult : function (result) {

        if(result.info){
            hall.MsgBoxManager.showToast({"title":result.info});
        }else {
            scratch.Share.shareKeywordReplace.tixianrmb = hall.GlobalFuncs.getMoneyStringWithCoupons(result.value);
            // hall.MsgBoxManager.showToast({"title":"提现成功"});
            scratch.GlobalFuncs.showScratchSuccess(1,result.value);
            var lastListString = hall.GlobalFuncs.ReadStringFromLocalStorage(scratch.gameModel.GET_CASH_LIST,"[]");
            var lastList = JSON.parse(lastListString);
            var newResult = {"value":result.value,"time":hall.GlobalTimer.getCurDay()};
            lastList.push(newResult);
            hall.GlobalFuncs.setInLocalStorage(scratch.gameModel.GET_CASH_LIST,JSON.stringify(lastList));
        }
    },
    seeDetailAction : function () {
        scratch.GlobalFuncs.showDrawList();
        // this.node.destroy();
    },
    textEditBegin : function (event) {
        //
        // var changedString = event.string;
        // this.numberEditBox.string = changedString;
    },
    textChangeAction : function (event) {
        // var changedString = event.detail.string;
        var changedString = event;
        var nowNumber = parseFloat(changedString).toFixed(2);
        if(!changedString || changedString.length <1 || changedString == NaN){
            nowNumber = 0;
        }
        this.nowMoney = nowNumber;
        this.numberEditBox.string = this.nowMoney;
    },

    textEditEndAction : function (event ) {
        this.drawButton.interactable = true;
        var changedString = event.string;
        // var changedString = event;

        var lossMoney = parseFloat(this.lossMoney).toFixed(2);
        var nowString = parseFloat(changedString).toFixed(2);
        if(nowString > 10000){
            nowString = parseFloat(changedString).toFixed(0);
        }

        if(!changedString || changedString.length <1 || isNaN(changedString)){
            nowString = 0.00;
        }
        if(Number(nowString) > Number(lossMoney)){
            nowString = lossMoney;
        }
        this.nowMoney = nowString;
        this.numberEditBox.string = this.nowMoney;
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
