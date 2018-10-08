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
        bottomNode : {
            default : null,
            type : cc.Node
        },

        phoneEditBox : {
            default : null,
            type : cc.EditBox
        },

        phoneNumber : null,
        resultMap : null
    },

    onBlack : function () {

    },

    onLoad : function() {
        if(ty.UserInfo.systemType == ty.UserInfo.SYSTEMTYPE.iPhoneXType || ty.UserInfo.systemType == ty.UserInfo.SYSTEMTYPE.ANDROIDVIVO85 ){
            this.bottomNode.y = -cc.director.getWinSize().height/2+70;
        }else {
            this.bottomNode.y = -cc.director.getWinSize().height/2;
        }
        ty.NotificationCenter.listen(scratch.EventType.GET_EXCHANGE_INFO,this.getChangeResult,this);
    },
    getChangeResult : function (result) {
        if(result.info){
            hall.MsgBoxManager.showToast({"title":result.info});
        }else {
            scratch.GlobalFuncs.showScratchSuccess(2,this.resultMap);
        }
    },

    updateTipsInfo : function (resultMap) {
        this.resultMap = resultMap;
    },
    textChangeAction : function (value) {
        this.phoneEditBox.string = value;
    },
    textEditEndAction : function (event) {
        var changedString = event.string;
        if(!changedString.length || changedString.length != 11){
            hall.MsgBoxManager.showToast({'title':"格式错误"});
            return;
        }
        this.phoneNumber = changedString;
    },

    cancelAction : function () {
        this.node.destroy();
    },
    sureAction : function () {
        if(!this.phoneNumber || this.phoneNumber.length != 11){
            hall.MsgBoxManager.showToast({'title':"手机号码格式错误"});
            return;
        }
        scratch.gameModel.exchangeProduct(this.resultMap.exchangeId,this.phoneNumber);
        // this.node.destroy();
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
