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

        withDrawNode : {
            default : null,
            type : cc.Node
        },
        moneyLabel : {
            default : null,
            type : cc.Label
        },

        changeNode : {
            default : null,
            type : cc.Node
        },
        changeSprite : {
            default : null,
            type : cc.Sprite
        },
        tipsDetailLabel : {
            default : null,
            type : cc.Label
        },
        type : 0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad : function() {

    },

    onBlack : function () {

    },

    updateTipsInfo : function (type ,info) {
        this.type = type;
        if(type == 1){
            this.withDrawNode.active = true;
            this.changeNode.active = false;
            this.moneyLabel.string = "￥"+ hall.GlobalFuncs.getMoneyStringWithCoupons(info);
        }else {
            this.withDrawNode.active = false;
            this.changeNode.active = true;
            ty.SystemInfo.getImageWithURL(info.pic,this.changeSprite);
            if(info.displayName.indexOf("话费") > -1){
                this.tipsDetailLabel.string = "话费将直接充入您的手机";
            }
        }
    },

    onShareOne : function () {
        if(this.type == 1){
            scratch.Share.shareWithType(scratch.Share.onShareType.tixianRMBshare);
        }else {
            scratch.Share.shareWithType(scratch.Share.onShareType.jdcardgetsuccessedshare);
        }

    },

    ignoreButtonAction : function () {
        this.node.destroy();
    }

    // start () {
    //
    // },

    // update (dt) {},
});
