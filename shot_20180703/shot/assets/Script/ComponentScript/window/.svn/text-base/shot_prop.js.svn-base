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
        ty.NotificationCenter.listen(shot.EventType.UPDATE_INFINITEBULLET_NUMBER,this.updateInfiniteByllet, this);
        ty.NotificationCenter.listen(shot.EventType.UPDATE_LASERAIMING_NUMBER,this.updateLaserAiming, this);
        ty.NotificationCenter.listen(shot.EventType.UPDATE_GRENADE_NUMBER,this.updateGrenadeAiming, this);
        ty.NotificationCenter.listen(shot.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
        ty.NotificationCenter.listen(shot.EventType.REWARD_VIDEO_COMPLETE,this.rewardVideoComplete, this);
        ty.NotificationCenter.listen(shot.EventType.REWARD_VIDEO_COMPLETE_ERROR,this.rewardVideoCompleteError, this);
    },

    playAnimationAfterShareWithType : function (shareType) {
        hall.LOGW("","file = [shot_prop] fun = [playAnimationAfterShareWithType]  ==="+shareType);
        var reultType = shot.Share.resultType;
        if (shareType && (shareType == shot.Share.onShareType.clickStatShareTypeLight ||
            shareType == shot.Share.onShareType.clickStatShareTypeBullet ||
            shareType == shot.Share.onShareType.clickStatShareTypeBulletGetReward ||
            shareType == shot.Share.onShareType.clickStatShareTypeLightGetReward||
            shareType == shot.Share.onShareType.clickStatShareTypeGrenade ||
            shareType == shot.Share.onShareType.clickStatShareTypeGrenadeGetReward)) {
            if(!shot.gameModel.shareTimeEnough){
                hall.MsgBoxManager.showToast({title : '换个群试试吧'});
                return;
            }

            var _config = shot.GameWorld.gunnerShareSchemeConfig;
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
            shot.Share.resultType = 0;
        }
        if( shareType == shot.Share.onShareType.clickStatShareTypeComboContinue){
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
        shot.Share.resultType = 0;
        }
        this.onClose();
    },

    comboContinue : function () {
        shot.GameWorld.doubleHitCount = shot.GameWorld.doubleHitCountBest;
        hall.MsgBoxManager.showToast({"title":"成功恢复至"+shot.GameWorld.doubleHitCount +"连击!"});
        shot.GameWorld.doubleHitContinueTime ++;
        shot.GameWorld.doubleHitCountDownTime = false;

        ty.NotificationCenter.trigger(shot.EventType.STOP_DOUBLEHIT_COUNTDOWN);
    },

    // 刷新无限子弹道具
    updateInfiniteByllet:function(){
        if (this.state == 0) {
            this.propName.string = "<color=#622508>无限子弹</c><color=#FF3333> x"+hall.ME.udataInfo.infiniteBulletCount+"</color>";
        }
    },

    // 刷新激光瞄准道具
    updateLaserAiming:function(){
        if (this.state == 1) {
            this.propName.string = "<color=#622508>激光道具</c><color=#FF3333> x"+hall.ME.udataInfo.laserAimingCount+"</color>";
        }
    },

    // 刷新激光瞄准道具
    updateGrenadeAiming:function(){
        if (this.state == 1) {
            this.propName.string = "<color=#622508>手榴弹</c><color=#FF3333> x"+hall.ME.udataInfo.grenadeCount+"</color>";
        }
    },

    updateToDoubleHitContinue : function () {
        shot.GlobalFuncs.hideAdBtnWithTag(5002,true);

        this.state = 2;
        // this.propSprite.spriteFrame = this.propSpriteList[1];
        this.titleLabel.string = "<color=#F1A955><b>恢复连击</b></c>";
        this.doubleHitNode.active = true;
        this.propSprite.node.active = false;
        this.doubleHitLabel.string = "+"+shot.GameWorld.doubleHitCountBest;
        this.propName.string = "";
        this.descText.string = "可恢复刚刚中断的连击";
        // this.btnText.string = "<color=#ffffff><b>分享到群恢复</b></color>";
        this.tips.string = "剩余次数:"+(shot.GameWorld.toolUserTimeConfig.comboContinueTime-shot.GameWorld.doubleHitContinueTime);
        this.tips.node.active = true;
        this.changeGetType();

    },
    updateInfo:function(result){
        shot.GlobalFuncs.hideAdBtnWithTag(5002,true);

        this.titleLabel.string = "<color=#F1A955><b>道 具</b></c>";
        this.propSprite.node.active = true;
        this.doubleHitNode.active = false;
        if (result.itemId && result.itemId == "item:1371") { // 无限子弹
            this.state = 0;
            this.propSprite.spriteFrame = this.propSpriteList[0];
            this.propName.string = "<color=#622508>无限子弹</c><color=#FF3333> x"+hall.ME.udataInfo.infiniteBulletCount+"</color>";
            this.descText.string = "使用后持续"+shot.GameWorld.propertyConfig.infiniteBullet.time+"秒子弹无限";
        }else if (result.itemId && result.itemId == "item:1390") { // 手榴弹道具
            this.state = 1;
            this.propSprite.spriteFrame = this.propSpriteList[1];
            this.propName.string = "<color=#622508>手榴弹</c><color=#FF3333> x"+hall.ME.udataInfo.grenadeCount+"</color>";
            this.descText.string = "使用后对所有酒瓶造成伤害";
        }
        if (result.boxId && result.boxId != "") {
            shot.Share.shareKeywordReplace.boxId = result.boxId;
        }
        this.changeGetType();
    },
    changeGetType : function () {
        var getTypeConfig ;
        if(this.state == 2){
            getTypeConfig = shot.GameWorld.toolUserTimeConfig.propType.combo;
        }else {
            getTypeConfig = shot.GameWorld.toolUserTimeConfig.propType.getItem;
        }
        var typeList ;
        if(ty.UserInfo.isInBSGS){
            typeList = getTypeConfig.bsgs;
        }else {
            typeList = getTypeConfig.nBsgs;
        }
        if(this.state != 2 && shot.gameModel.getAllCheckConfig()){
            typeList = ["ad","shareClick"];
        }
        if(typeList && typeList[0] == "ad"){
            if(hall.adManager.canPlay){
                this.getType = "getPropAd";
            }else if(typeList.length > 1 && (typeList[1] == "share" || typeList[1] == "shareRec")){
                this.getType = "getPropShare";
                if(typeList[1] == "shareRec"){
                    shot.gameModel.shareRec = true;
                }
            }else if(typeList.length > 1 && typeList[1] == "shareClick"){
                this.getType = "getPropShareClick";
            }else {
                this.getType = "getProp";
            }
        }else if(typeList[0] == "share" || typeList[0] == "shareRec"){
            this.getType = "getPropShare";
            if(typeList[0] == "shareRec"){
                shot.gameModel.shareRec = true;
            }
        }else if(typeList[0] == "shareClick"){
            this.getType = "getPropShareClick";
        }else {
            this.getType = "getProp";
        }
        this.tips.node.active = false;
        if(this.state == 2){
            if(this.getType == "getPropShare"){
                this.btnText.string = "<color=#ffffff><b>免费恢复</b></color>";
            }else if(this.getType == "getPropAd"){
                this.btnText.string = "<color=#ffffff><b>看视频恢复</b></color>";
            }else {
                this.btnText.string = "<color=#ffffff><b>恢复</b></color>";
            }
        }else {
            if(this.getType == "getPropShareClick"){
                this.tips.node.active = true;
                this.tips.string = "自己也可以进群抢道具哦";
                this.btnText.string = "<color=#ffffff><b>赠 送</b></color>";
            }else if(this.getType == "getPropAd"){
                this.btnText.string = "<color=#ffffff><b><size=44>看视频领取</b></color>";
            }else if(this.getType == "getPropShare"){
                this.btnText.string = "<color=#ffffff><b><size=44>免费领道具</b></color>";
            }else {
                this.btnText.string = "<color=#ffffff><b>领取</b></color>";
            }
        }
    },

    onClickCenterBtn:function(){
        if(this.state == 2){
            if(this.getType == "getPropShare"){
                // shot.gameModel.shareRec = shot.GameWorld.toolUserTimeConfig.propType.combo.shareRec;
                shot.Share.shareWithType(shot.Share.onShareType.clickStatShareTypeComboContinue);
            }else if(this.getType == "getPropAd"){
                hall.adManager.showRewardedVideo("combo");
            }else {
                this.comboContinue();
                this.onClose();
            }
        }else {
            // shot.gameModel.shareRec = shot.GameWorld.toolUserTimeConfig.propType.getItem.shareRec;
            if(this.getType == "getPropShareClick"){
                if(this.state == 1){
                    shot.Share.shareWithType(shot.Share.onShareType.clickStatShareTypeGrenade);
                }else {
                    shot.Share.shareWithType(shot.Share.onShareType.clickStatShareTypeBullet);
                }
            }else if(this.getType == "getPropAd"){
                hall.adManager.showRewardedVideo("getProp");
            }else if(this.getType == "getPropShare"){
                if(this.state == 1){
                    shot.Share.shareWithType(shot.Share.onShareType.clickStatShareTypeGrenadeGetReward);
                }else {
                    shot.Share.shareWithType(shot.Share.onShareType.clickStatShareTypeBulletGetReward);
                }
            }else {
                if(this.state == 1){
                   shot.gameModel.shareToGetreward(shot.Share.SharePointType.getGrenade)
                }else {
                    shot.gameModel.shareToGetreward(shot.Share.SharePointType.getBullet)
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
                    shot.gameModel.shareToGetreward(shot.Share.SharePointType.getGrenade)
                }else {
                    shot.gameModel.shareToGetreward(shot.Share.SharePointType.getBullet)
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
                shot.gameModel.shareToGetreward(shot.Share.SharePointType.getGrenade)
            }else {
                shot.gameModel.shareToGetreward(shot.Share.SharePointType.getBullet)
            }
        }
        this.onClose();
    },

    onClose:function(){
        if(this.state == 2){
            shot.GameWorld.doubleHitCountDownTime = true;
        }
        this.centerBtn.node.stopAllActions();
        // this.node.destroy();
        this.node.removeFromParent();
        shot.GlobalFuncs.showAdBtnWithTag(5002,"normalLevel");
    },
    onBlack : function () {

    },

    onDestroy:function(){
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }
});
