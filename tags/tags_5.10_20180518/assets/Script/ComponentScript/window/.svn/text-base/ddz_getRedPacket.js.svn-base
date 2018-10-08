

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

        buttonText :{
            default : null,
            type : cc.RichText
        },//白框

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
        var shareType = ddz.Share.onShareType.clickStatShareTypeWithDraw;
        ddz.Share.shareWithType(shareType);
    },

    getDiamond:function(){
        hall.LOGW("=="," file = [ddz_getRedPacket] fun = [getDiamond] ");
        ddz.GlobalFuncs.playZuanShi(true);
    },

    playAnimationAfterShareWithType : function (shareType) {

        if (shareType && shareType != ddz.Share.onShareType.clickStatShareTypeWithDraw) {
            return;
        }
        ddz.gameModel.checkShareReward(ddz.Share.SharePointType.redPacket);
        var type = ddz.Share.resultType;
        hall.LOGD("=="," file = [ddz_getRedPacket] fun = [playAnimationAfterShareWithType] type = " + type);
        switch (type){
            case 1:
                //TODO:分享到微信群才能领取奖励哦
                var tips = "只有分享到微信群才能领取奖励哦";
                this.addTipsWindow(tips);
                break;
            case 2:
                var tips = "这个群已经分享过啦，分享到其他群吧";
                this.addTipsWindow(tips);
                break;
            case 3:
                break;
            default:
                break;
        }
        ddz.Share.resultType = 0;
    },

    addTipsWindow : function (tips,timer) {
        var preFabPath = "prefabs/ddz_window_tips";
        var  comName = "ddz_tipsWindow";
        var that = this;
        hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
            var window = preFabNode.getComponent(comName);
            window.parentScene = that;
            var testArray = [
                {
                    title :"分享到群",
                    bottomType : 0
                }
            ];
            window.setTitleContentAndButtons("提示",tips, testArray);
            if (timer && timer > 0){
                window.updatePos(timer);
            }
        });
    },

    // 点击tips 确定按钮
    onClickCenterButton:function(){
        var shareType = ddz.Share.onShareType.clickStatShareTypeWithDraw;
        ddz.Share.shareWithType(shareType);
    },

    updateButtonText:function(data){
        hall.LOGW("=="," file = [ddz_getRedPacket] fun = [updateButtonText] diamond = " + data.leftCount);
        if (data.pointId != ddz.Share.SharePointType.redPacket){
            return;
        }

        if (!data.leftCount || data.leftCount <= 0) {
            this.buttonText.string = "<color=#FFFFFF>分享到群</c>";
        }else {
            this.buttonText.string = "<color=#FFFFFF>分享到群</c><img src='dda_button_diamond' height=34 width=42/><color=#FFFFFF>+1</c>";
        }
    },

    onLoad :function() {
        this.shareButton.node.on("click",this.onShareButton,this);
        ty.NotificationCenter.listen(ty.EventType.GET_DIAMOND, this.getDiamond, this);
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
        ty.NotificationCenter.listen(ty.EventType.UPDATE_BUTTON_TEXT, this.updateButtonText, this);
        ddz.gameModel.checkShareReward(ddz.Share.SharePointType.redPacket);
        // this.setRedPacketNumber("58.62");
    },
    onDestroy : function () {
        // this.shareButton.node.off("click",this.onShareButton,this);
        ty.NotificationCenter.ignoreScope(this);
    }

    // update (dt) {},
});