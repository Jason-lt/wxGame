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
        centerBtn:cc.Button,
        aniSpriteNode:cc.Node,
        tips:cc.Label,
        tipsRich : cc.RichText,
        btnText:cc.RichText
    },

    onLoad:function(){
        hall.GlobalFuncs.btnScaleEffect(this.centerBtn.node,1.13);
        ty.NotificationCenter.listen(snipe.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
        this.updateTips();
    },

    playAnimationAfterShareWithType : function (shareType) {
        if (shareType && shareType == snipe.Share.onShareType.clickStatShareTypeMysteryGiftBag ||
            shareType == snipe.Share.onShareType.clickStatShareTypeMysteryGiftBagGetReward) {
            var _config = snipe.GameWorld.gunnerShareSchemeConfig;
            if (_config && _config.giftBagShareGetDiamond && !ty.UserInfo.isInBSGS){
                var reultType = snipe.Share.resultType;
                switch (reultType) {
                    case 1:
                        hall.MsgBoxManager.showToast({title : '分享到群才有效哦~'});
                        break;
                    case 2:
                        hall.MsgBoxManager.showToast({title : '这个群今天已经打扰过了哦~'});
                        break;
                    case 3:

                        break;
                    default:
                        break;
                }
            }else {
                hall.MsgBoxManager.showToast({title : "快进群抢礼包吧~"});
            }
            snipe.Share.resultType = 0;
        }
    },

    updateTips:function(){
        // var _config = snipe.GameWorld.gunnerShareSchemeConfig;
        // if (_config && _config.giftBagShareGetDiamond && !ty.UserInfo.isInBSGS){
        //     this.btnText.string = "<color=#ffffff><b><size=44>分享/b></color>";
        //     this.tips.string = "分享到群领钻石";
        // }else {
        //     this.btnText.string = "<color=#ffffff><b>进群抢钻石</b></color>";
        //     this.tips.string = "先到先得，抢完为止\n自己也能抢哦~";
        // }

        snipe.GlobalFuncs.hideAdBtnWithTag(5002,true);

        this.btnText.string = "<color=#2B2B2B><b><size=44>分享礼包</b></color>";
        this.tipsRich.string = "<color=#622508>分享到群里可以和朋友一起抢</c><img src='shot_gift_diamond'/><color=#622508>哦</c>";
    },

    updateInfo:function(result){
        // if (result.boxId && result.boxId != "") {
        //     snipe.Share.shareKeywordReplace.mysteryGiftBagBoxId = result.boxId;
        // }
    },

    onClickCenterButton:function(){
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["mysteryGifgBag"]);
        var _config = snipe.GameWorld.gunnerShareSchemeConfig;
        if (_config && _config.giftBagShareGetDiamond && !ty.UserInfo.isInBSGS){
            snipe.Share.shareWithType(snipe.Share.onShareType.clickStatShareTypeMysteryGiftBagGetReward);
        }else {
            snipe.Share.shareWithType(snipe.Share.onShareType.clickStatShareTypeMysteryGiftBag);
        }
    },

    onClose:function(){
        this.centerBtn.node.stopAllActions();
        this.node.destroy();
    },

    onBlack : function () {

    },

    update:function(dt){
        // this.aniSpriteNode.rotation += 1;
    },

    onDestroy:function(){
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }
});
