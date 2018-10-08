

// var ddz_getReward_Withdraw = cc.instantiate(this.tipsWindow);
// this.node.addChild(ddz_getReward_Withdraw);
// var window = ddz_getReward_Withdraw.getComponent('ddz_getReward_Withdraw');
// window.setLossMoneyNumber("52.91");
// window.setTipsString("<color=#ffffff>1.微信单笔提现金额最低5元，最高10000元<br/>2.单日领奖次数不超过30次</color>");
cc.Class({
    extends: cc.Component,

    properties: {
        lossMoneyString : "0",//余额
        drawMoeyString : "0",//提现金额
        oldMoneyString : "0",//输入前的文本框文本
        numberEditBox : {
            default : null,
            type : cc.EditBox
        },
        lossMoneyLabel: {
            default : null,
            type : cc.Label
        },
        allButton : {
            default : null,
            type : cc.Button
        },
        tipsText : {
            default : null,
            type : cc.RichText
        },
        // drawButton : {
        //     default : null,
        //     type : cc.Button
        // },
    },
    setLossMoneyNumber : function () {
        var couponCount = hall.ME.udataInfo.m_couponCount;
        var lossMoneyString;
        if(!couponCount){
            lossMoneyString = "0";
        }else {
            lossMoneyString = couponCount/100+"";
        }
        this.lossMoneyLabel.string = "账户可用余额"+lossMoneyString+"元，";
        this.lossMoneyString = lossMoneyString;

        this.oldMoneyString = "0";
        this.drawMoeyString = this.oldMoneyString;
        this.numberEditBox.string = this.drawMoeyString;
        // this.drawButton.node.on("click",this.onDrawButton,this);
    },
    setTipsString : function (tipsString) {
        // "<color=#ffffff>1.微信单笔提现金额最低5元，最高1000元<br/>2.单日领奖次数不超过3次</color>"
        this.tipsText.string = tipsString;
    },
    onAllButton : function () {
        this.oldMoneyString = parseInt(this.lossMoneyString)+"";
        this.drawMoeyString = this.oldMoneyString;
        this.numberEditBox.string = this.drawMoeyString;
    },
    // onDrawButton:function () {
    //     ddz.LOGD(null, "onDrawButton");
    // },


    onLoad : function() {
        this.oldMoneyString = "0";
        this.drawMoeyString = this.oldMoneyString;
        this.numberEditBox.string = this.drawMoeyString;
        this.numberEditBox.node.on("text-changed",this.numberEditChange,this);
        this.numberEditBox.node.on("editing-did-ended",this.numberEditEnd,this);
        this.allButton.node.on("click",this.onAllButton,this);
        this.setLossMoneyNumber();
    },

    numberEditChange:function (event) {

        var changedString = event.detail.string;
        // ddz.LOGD(null, "numberEditChangenumberEditChangenumberEditChange===="+ changedString);
        var nowNumber = parseInt(changedString);
        if(!changedString || changedString.length <1 || changedString == NaN){
            nowNumber = 0;
        }
        this.oldMoneyString = nowNumber + "";
        this.drawMoeyString = this.oldMoneyString;
        this.numberEditBox.string = this.drawMoeyString;
    },

    numberEditEnd : function (event) {
        var changedString = event.detail.string;
        var lossMoney = parseInt(this.lossMoneyString);
        var nowNumber = parseInt(changedString);
        // ddz.LOGD(null, "numberEditEndnumberEditEndnumberEditEnd===="+ changedString+"===="+ lossMoney);

        if(!changedString || changedString.length <1 || changedString == NaN){
            nowNumber = 0;
        }
        if(nowNumber > lossMoney){
            nowNumber = lossMoney;
        }
        this.oldMoneyString = nowNumber + "";
        this.drawMoeyString = this.oldMoneyString;
        this.numberEditBox.string = this.drawMoeyString;
    },
    onDestroy : function () {
        // this.allButton.node.off("click",this.onAllButton,this);
        // this.numberEditBox.node.off("text-changed",this.numberEditChange,this);
        // this.numberEditBox.node.off("editing-did-ended",this.numberEditEnd,this);
    },
    endTextEdit : function () {
        // // this.numberEditBox.emit("editing-did-ended");
        // // this.numberEditBox.node.emit("editing-return");
        // // this.numberEditBox.setVisible(false);
        // this.numberEditBox.node.setVisible(false);
    }

    // update (dt) {},
});
