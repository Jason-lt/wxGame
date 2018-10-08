

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
        },
        numberString :""
    },

    setRedPacketNumber:function (numberString,buttonString) {
        this.numberString = numberString+"";
        var window = this.ddz_redpacket.getComponent('ddz_redPacket');
        window.setRedPacketNumber(this.numberString);
        if(buttonString){
            this.shareLabel.string = buttonString;
        }
        // this.shareButton.node.on("click",this.onShareButton,this);
    },

    onShareButton : function (event) {
        ddz.LOGD(null, "onShareButton");
        ty.TuyooSDK.shareWithType(ty.UserInfo.clickStatShareType.clickStatShareTypeWithDraw);
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