

// var ddz_getRedPacket = cc.instantiate(this.tipsWindow);
// this.node.addChild(ddz_getRedPacket);
// var window = ddz_getRedPacket.getComponent('ddz_getRedPacket');
// window.setRedPacketNumber("20.98");
cc.Class({
    extends: cc.Component,

    properties: {
        ddz_redpacket:{
            default : null,
            type : cc.Node
        },
        shareButton : {
            default : null,
            type : cc.Button
        },
        shareLabel : {
            default : null,
            type : cc.Label
        }
    },

    setRedPacketNumber:function (numberString,buttonString) {
        var window = this.ddz_redpacket.getComponent('ddz_redPacket');
        window.setRedPacketNumber(numberString);
        if(buttonString){
            this.shareLabel.string = buttonString;
        }
        // this.shareButton.node.on("click",this.onShareButton,this);
    },


    onShareButton : function (event) {
        ddz.LOGD(null, "onShareButton");
        var titleA = ["我在富豪斗地主赢得了现金奖励，快来和我一起玩！",
            "斗地主赢现金，快来试试你能赢多少~",
            "斗地主赢现金大奖，来和我比一比，谁赢更多~"];
        var count = (Math.floor(Math.random()*10))%3;
        ty.TuyooSDK.shareWithInformation(titleA[count],"");
        //TODO:分享图片
        wx.showToast({title:titleA[count]});
    },

    onLoad :function() {
        this.shareButton.node.on("click",this.onShareButton,this);
        // this.setRedPacketNumber("58.62");
    },
    onDestroy : function () {
        // this.shareButton.node.off("click",this.onShareButton,this);
    }

    // update (dt) {},
});