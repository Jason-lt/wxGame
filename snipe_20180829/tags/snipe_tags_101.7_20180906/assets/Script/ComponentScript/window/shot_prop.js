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
        titleLabel : {
            default : null,
            type : cc.RichText
        },
        doubleHitNode : {
            default : null,
            type : cc.Node
        },
        doubleHitLabel : {
            default : null,
            type : cc.Label
        },

        propName:cc.RichText,
        descText:cc.Label,
        centerBtn:cc.Button,
        propSprite:cc.Sprite,
        propSpriteList : [cc.SpriteFrame],
        boxId:"",
        getType : "",
        btnText:cc.RichText,
        tips:cc.Label
    },

    onLoad:function(){
        hall.GlobalFuncs.btnScaleEffect(this.centerBtn.node,1.13);
        this.state = 0;
        ty.NotificationCenter.listen(snipe.EventType.UPDATE_INFINITEBULLET_NUMBER,this.updateInfiniteByllet, this);
        ty.NotificationCenter.listen(snipe.EventType.UPDATE_LASERAIMING_NUMBER,this.updateLaserAiming, this);
        ty.NotificationCenter.listen(snipe.EventType.UPDATE_GRENADE_NUMBER,this.updateGrenadeAiming, this);
        ty.NotificationCenter.listen(snipe.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
        ty.NotificationCenter.listen(snipe.EventType.REWARD_VIDEO_COMPLETE,this.rewardVideoComplete, this);
        ty.NotificationCenter.listen(snipe.EventType.REWARD_VIDEO_COMPLETE_ERROR,this.rewardVideoCompleteError, this);
    },

    playAnimationAfterShareWithType : function (shareType) {
        hall.LOGW("","file = [snipe_prop] fun = [playAnimationAfterShareWithType]  ==="+shareType);
        var reultType = snipe.Share.resultType;
        if (shareType && (shareType == snipe.Share.onShareType.clickStatShareTypeLight ||
            shareType == snipe.Share.onShareType.clickStatShareTypeBullet ||
            shareType == snipe.Share.onShareType.clickStatShareTypeBulletGetReward ||
            shareType == snipe.Share.onShareType.clickStatShareTypeLightGetReward||
            shareType == snipe.Share.onShareType.clickStatShareTypeGrenade ||
            shareType == snipe.Share.onShareType.clickStatShareTypeGrenadeGetReward)) {

            var _config = snipe.GameWorld.gunnerShareSchemeConfig;
            if (_config && _config.boxShareGetProp && !ty.UserInfo.isInBSGS){
                switch (reultType) {
                    case 1:
                        hall.MsgBoxManager.showToast({title : '分享到群才有效哦~'});
                        break;
                    case 2:
                        hall.MsgBoxManager.showToast({title : '这个群今天已经打扰过了哦~'});
                        break;
                    case 3:
                        hall.MsgBoxManager.showToast({title : '分享成功'});
                        break;
                    default:
                        // hall.MsgBoxManager.showToast({title : "出现错误"+reultType});
                        hall.MsgBoxManager.showToast({title : "分享失败"});
                        break;
                }
            }else{
                switch (reultType) {
                    case 0:
                        hall.MsgBoxManager.showToast({title : "快进群点击分享卡片抢道具吧~"});
                        break;
                    case 1:
                        hall.MsgBoxManager.showToast({title : '进群抢才有效哦~'});
                        break;
                    case 2:
                        hall.MsgBoxManager.showToast({title : '进入不同群可以抢更多道具哦~'});
                        break;
                    case 3:
                        hall.MsgBoxManager.showToast({title : "快进群点击分享卡片抢道具吧~"});
                        break;
                    default:
                        // hall.MsgBoxManager.showToast({title : "出现错误"+reultType});
                        hall.MsgBoxManager.showToast({title : "分享失败"});
                        break;
                }
            }
            snipe.Share.resultType = 0;
        }
        if( shareType == snipe.Share.onShareType.clickStatShareTypeComboContinue){
            switch (reultType) {
                // case 0:
                //     // hall.MsgBoxManager.showToast({title : "分享成功才有效哦"});
                //     break;
                case 1:
                    hall.MsgBoxManager.showToast({title : '分享到不同群才有效哦'});
                    break;
                case 2:
                    hall.MsgBoxManager.showToast({title : '分享到不同群才有效哦'});
                    break;
                case 3:
                    this.comboContinue();
                    break;
                default:
                    hall.MsgBoxManager.showToast({title : '分享失败'});
                    break;
            }
        snipe.Share.resultType = 0;
        }
        this.onClose();
    },

    comboContinue : function () {
        snipe.GameWorld.doubleHitCount = snipe.GameWorld.doubleHitCountBest;
        hall.MsgBoxManager.showToast({"title":"成功恢复至"+snipe.GameWorld.doubleHitCount +"连击!"});
        snipe.GameWorld.doubleHitContinueTime ++;
        snipe.GameWorld.doubleHitCountDownTime = false;

        ty.NotificationCenter.trigger(snipe.EventType.STOP_DOUBLEHIT_COUNTDOWN);
    },

    // 刷新无限子弹道具
    updateInfiniteByllet:function(){
        if (this.state == 0) {
            this.propName.string = "<color=#4EA8DA>无限子弹</c><color=#FF3333> x"+hall.ME.udataInfo.infiniteBulletCount+"</color>";
        }
    },

    // 刷新激光瞄准道具
    updateLaserAiming:function(){
        if (this.state == 1) {
            this.propName.string = "<color=#4EA8DA>激光道具</c><color=#FF3333> x"+hall.ME.udataInfo.laserAimingCount+"</color>";
        }
    },

    // 刷新激光瞄准道具
    updateGrenadeAiming:function(){
        if (this.state == 1) {
            this.propName.string = "<color=#4EA8DA>手榴弹</c><color=#FF3333> x"+hall.ME.udataInfo.grenadeCount+"</color>";
        }
    },

    updateToDoubleHitContinue : function () {
        this.state = 2;
        // this.propSprite.spriteFrame = this.propSpriteList[1];
        this.titleLabel.string = "<color=#F1A955><b>恢复连击</b></c>";
        this.doubleHitNode.active = true;
        this.propSprite.node.active = false;
        this.doubleHitLabel.string = "+"+snipe.GameWorld.doubleHitCountBest;
        this.propName.string = "";
        this.descText.string = "可恢复刚刚中断的连击";
        // this.btnText.string = "<color=#ffffff><b>分享到群恢复</b></color>";
        this.tips.string = "剩余次数:"+(snipe.GameWorld.toolUserTimeConfig.comboContinueTime-snipe.GameWorld.doubleHitContinueTime);
        this.tips.node.active = true;
        this.changeGetType();

    },
    updateInfo:function(result){
        this.titleLabel.string = "<color=#F1A955><b>道 具</b></c>";
        this.propSprite.node.active = true;
        this.doubleHitNode.active = false;
        if (result.itemId && result.itemId == "item:1371") { // 无限子弹
            this.state = 0;
            this.propSprite.spriteFrame = this.propSpriteList[0];
            this.propName.string = "<color=#4EA8DA>无限子弹</c><color=#FF3333> x"+hall.ME.udataInfo.infiniteBulletCount+"</color>";
            this.descText.string = "使用后持续"+snipe.GameWorld.propertyConfig.infiniteBullet.time+"秒子弹无限";
        }else if (result.itemId && result.itemId == "item:1390") { // 手榴弹道具
            this.state = 1;
            this.propSprite.spriteFrame = this.propSpriteList[1];
            this.propName.string = "<color=#4EA8DA>手榴弹</c><color=#FF3333> x"+hall.ME.udataInfo.grenadeCount+"</color>";
            this.descText.string = "使用后对所有酒瓶造成伤害";
        }
        if (result.boxId && result.boxId != "") {
            snipe.Share.shareKeywordReplace.boxId = result.boxId;
        }
        this.changeGetType();
    },
    changeGetType : function () {
        var getTypeConfig ;
        if(this.state == 2){
            getTypeConfig = snipe.GameWorld.toolUserTimeConfig.propType.combo;
        }else {
            getTypeConfig = snipe.GameWorld.toolUserTimeConfig.propType.getItem;
        }
        var typeList ;
        if(ty.UserInfo.isInBSGS){
            typeList = getTypeConfig.bsgs;
        }else {
            typeList = getTypeConfig.nBsgs;
        }
        if(this.state != 2 && snipe.gameModel.getAllCheckConfig()){
            // typeList = ["ad","shareClick"];
            typeList = ["ad","direct"];
        }
        if(typeList && typeList[0] == "ad"){
            if(hall.adManager.canPlay){
                this.getType = "getPropAd";
            }else if(typeList.length > 1 && typeList[1] == "share"){
                this.getType = "getPropShare";
            }else if(typeList.length > 1 && typeList[1] == "shareClick"){
                this.getType = "getPropShareClick";
            }else {
                this.getType = "getProp";
            }
        }else if(typeList[0] == "share"){
            this.getType = "getPropShare";
        }else if(typeList[0] == "shareClick"){
            this.getType = "getPropShareClick";
        }else {
            this.getType = "getProp";
        }
        this.tips.node.active = false;
        if(this.state == 2){
            if(this.getType == "getPropShare"){
                this.btnText.string = "<color=#2B2B2B><b>免费恢复</b></color>";
            }else if(this.getType == "getPropAd"){
                this.btnText.string = "<color=#2B2B2B><b>看视频恢复</b></color>";
            }else {
                this.btnText.string = "<color=#2B2B2B><b>恢复</b></color>";
            }
        }else {
            if(this.getType == "getPropShareClick"){
                this.tips.node.active = true;
                this.tips.string = "自己也可以进群抢道具哦";
                this.btnText.string = "<color=#2B2B2B><b>赠 送</b></color>";
            }else if(this.getType == "getPropAd"){
                this.btnText.string = "<color=#2B2B2B><b><size=44>看视频领取</b></color>";
            }else if(this.getType == "getPropShare"){
                this.btnText.string = "<color=#2B2B2B><b><size=44>免费领道具</b></color>";
            }else {
                this.btnText.string = "<color=#2B2B2B><b>领取</b></color>";
            }
        }
    },

    onClickCenterBtn:function(){
        if(this.state == 2){
            if(this.getType == "getPropShare"){
                snipe.Share.shareWithType(snipe.Share.onShareType.clickStatShareTypeComboContinue);
            }else if(this.getType == "getPropAd"){
                hall.adManager.showRewardedVideo("combo");
            }else {
                this.comboContinue();
                this.onClose();
            }
        }else {
            if(this.getType == "getPropShareClick"){
                if(this.state == 1){
                    snipe.Share.shareWithType(snipe.Share.onShareType.clickStatShareTypeGrenade);
                }else {
                    snipe.Share.shareWithType(snipe.Share.onShareType.clickStatShareTypeBullet);
                }
            }else if(this.getType == "getPropAd"){
                hall.adManager.showRewardedVideo("getProp");
            }else if(this.getType == "getPropShare"){
                if(this.state == 1){
                    snipe.Share.shareWithType(snipe.Share.onShareType.clickStatShareTypeGrenadeGetReward);
                }else {
                    snipe.Share.shareWithType(snipe.Share.onShareType.clickStatShareTypeBulletGetReward);
                }
            }else {
                if(this.state == 1){
                   snipe.gameModel.shareToGetreward(snipe.Share.SharePointType.getGrenade)
                }else {
                    snipe.gameModel.shareToGetreward(snipe.Share.SharePointType.getBullet)
                }
                this.onClose();
            }
        }
    },
    rewardVideoComplete : function(isEnd){
        if(hall.adManager.rewardedVideoType != "combo" && hall.adManager.rewardedVideoType != "getProp"){
            return;
        }
        if(isEnd){
            if(hall.adManager.rewardedVideoType == "combo"){
                this.comboContinue();
            }else {
                if(this.state == 1){
                    snipe.gameModel.shareToGetreward(snipe.Share.SharePointType.getGrenade)
                }else {
                    snipe.gameModel.shareToGetreward(snipe.Share.SharePointType.getBullet)
                }
            }
        }else {
            hall.MsgBoxManager.showToast({"title":"视频播放未完成"});
        }
        this.onClose();
    },

    rewardVideoCompleteError : function (errorMsg) {
        if(hall.adManager.rewardedVideoType != "combo" && hall.adManager.rewardedVideoType != "getProp"){
            return;
        }
        hall.MsgBoxManager.showToast({"title":errorMsg});
        if(hall.adManager.rewardedVideoType == "combo"){
            this.comboContinue();
        }else {
            if(this.state == 1){
                snipe.gameModel.shareToGetreward(snipe.Share.SharePointType.getGrenade)
            }else {
                snipe.gameModel.shareToGetreward(snipe.Share.SharePointType.getBullet)
            }
        }
        this.onClose();
    },

    onClose:function(){
        if(this.state == 2){
            snipe.GameWorld.doubleHitCountDownTime = true;
        }
        this.centerBtn.node.stopAllActions();
        this.node.destroy();
    },
    onBlack : function () {

    },

    onDestroy:function(){
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }
});
