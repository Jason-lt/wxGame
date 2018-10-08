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
        propName:cc.RichText,
        descText:cc.Label,
        centerBtn:cc.Button,
        propSprite:cc.Sprite,
        propSpriteList : [cc.SpriteFrame],
        boxId:"",
        btnText:cc.RichText,
        tips:cc.Label
    },

    onLoad:function(){
        hall.GlobalFuncs.btnScaleEffect(this.centerBtn.node,1.13);
        this.state = 0;
        ty.NotificationCenter.listen(shot.EventType.UPDATE_INFINITEBULLET_NUMBER,this.updateInfiniteByllet, this);
        ty.NotificationCenter.listen(shot.EventType.UPDATE_LASERAIMING_NUMBER,this.updateLaserAiming, this);
        ty.NotificationCenter.listen(shot.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
    },

    playAnimationAfterShareWithType : function (shareType) {
        if (shareType && shareType == shot.Share.onShareType.clickStatShareTypeLight ||
            shareType == shot.Share.onShareType.clickStatShareTypeBullet ||
            shareType == shot.Share.onShareType.clickStatShareTypeBulletGetReward ||
            shareType == shot.Share.onShareType.clickStatShareTypeLightGetReward) {
            var reultType = shot.Share.resultType;

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
                        break;
                    default:
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
                        break;
                }
            }
            shot.Share.resultType = 0;
        }
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

    updateInfo:function(result){
        if (result.itemId && result.itemId == "item:1371") { // 无限子弹
            this.state = 0;
            this.propSprite.spriteFrame = this.propSpriteList[0];
            this.propName.string = "<color=#622508>无限子弹</c><color=#FF3333> x"+hall.ME.udataInfo.infiniteBulletCount+"</color>";
            // this.descText.string = "使用后持续2秒子弹无限";
            this.descText.string = "使用后持续"+shot.GameWorld.propertyConfig.infiniteBullet.time+"秒子弹无限";
            this.state = 0;
        }else if (result.itemId && result.itemId == "item:1372") { // 激光道具
            this.state = 1;
            this.propSprite.spriteFrame = this.propSpriteList[1];
            this.propName.string = "<color=#622508>瞄准器道具</c><color=#FF3333> x"+hall.ME.udataInfo.laserAimingCount+"</color>";
            this.descText.string = "使用后当前关卡获得瞄准器";
            this.state = 1;
        }
        if (result.boxId && result.boxId != "") {
            shot.Share.shareKeywordReplace.boxId = result.boxId;
        }
        var _config = shot.GameWorld.gunnerShareSchemeConfig;
        if (_config && _config.boxShareGetProp && !ty.UserInfo.isInBSGS){
            this.btnText.string = "<color=#ffffff><b><size=44>分享到群领道具</b></color>";
            this.tips.node.active = false;
        }else{
            this.btnText.string = "<color=#ffffff><b>赠 送</b></color>";
        }
    },

    onClickCenterBtn:function(){
        var _config = shot.GameWorld.gunnerShareSchemeConfig;
        if (this.state == 0){   // 无限子弹
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["propBoxBulletShare"]);
            if (_config && _config.boxShareGetProp && !ty.UserInfo.isInBSGS){
                shot.Share.shareWithType(shot.Share.onShareType.clickStatShareTypeBulletGetReward);
            }else {
                shot.Share.shareWithType(shot.Share.onShareType.clickStatShareTypeBullet);
            }
        }else if (this.state == 1) {    // 激光瞄准器
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["propBoxLaserShare"]);
            if (_config && _config.boxShareGetProp && !ty.UserInfo.isInBSGS){
                shot.Share.shareWithType(shot.Share.onShareType.clickStatShareTypeLightGetReward);
            }else {
                shot.Share.shareWithType(shot.Share.onShareType.clickStatShareTypeLight);
            }
        }
        this.onClose();
    },

    onClose:function(){
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
