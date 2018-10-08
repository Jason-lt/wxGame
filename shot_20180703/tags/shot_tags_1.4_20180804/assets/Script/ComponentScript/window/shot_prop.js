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
                    shot.GameWorld.doubleHitCount = shot.GameWorld.doubleHitCountBest;
                    hall.MsgBoxManager.showToast({"title":"成功恢复至"+shot.GameWorld.doubleHitCount +"连击!"});
                    shot.GameWorld.doubleHitContinueTime ++;
                    shot.GameWorld.doubleHitCountDownTime = false;

                    ty.NotificationCenter.trigger(shot.EventType.STOP_DOUBLEHIT_COUNTDOWN);
                    break;
                default:
                    hall.MsgBoxManager.showToast({title : '分享失败'});
                    break;
            }
        shot.Share.resultType = 0;
        }
        this.onClose();
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
        this.state = 2;
        // this.propSprite.spriteFrame = this.propSpriteList[1];
        this.titleLabel.string = "<color=#F1A955><b>恢复连击</b></c>";
        this.doubleHitNode.active = true;
        this.propSprite.node.active = false;
        this.doubleHitLabel.string = "+"+shot.GameWorld.doubleHitCountBest;
        this.propName.string = "";
        this.descText.string = "可恢复刚刚中断的连击";
        this.btnText.string = "<color=#ffffff><b>分享到群恢复</b></color>";
        this.tips.string = "剩余次数:"+(shot.GameWorld.toolUserTimeConfig.comboContinueTime-shot.GameWorld.doubleHitContinueTime);
        this.tips.node.active = true;

    },
    updateInfo:function(result){
        this.titleLabel.string = "<color=#F1A955><b>道 具</b></c>";
        this.propSprite.node.active = true;
        this.doubleHitNode.active = false;
        if (result.itemId && result.itemId == "item:1371") { // 无限子弹
            this.state = 0;
            this.propSprite.spriteFrame = this.propSpriteList[0];
            this.propName.string = "<color=#622508>无限子弹</c><color=#FF3333> x"+hall.ME.udataInfo.infiniteBulletCount+"</color>";
            // this.descText.string = "使用后持续2秒子弹无限";
            this.descText.string = "使用后持续"+shot.GameWorld.propertyConfig.infiniteBullet.time+"秒子弹无限";
        // }else if (result.itemId && result.itemId == "item:1372") { // 激光道具
        //     this.state = 1;
        //     this.propSprite.spriteFrame = this.propSpriteList[1];
        //     this.propName.string = "<color=#622508>瞄准器道具</c><color=#FF3333> x"+hall.ME.udataInfo.laserAimingCount+"</color>";
        //     this.descText.string = "使用后当前关卡获得瞄准器";
        }else if (result.itemId && result.itemId == "item:1390") { // 手榴弹道具
            this.state = 1;
            this.propSprite.spriteFrame = this.propSpriteList[1];
            this.propName.string = "<color=#622508>手榴弹道具</c><color=#FF3333> x"+hall.ME.udataInfo.grenadeCount+"</color>";
            this.descText.string = "使用后对所有酒瓶造成伤害";
        }
        if (result.boxId && result.boxId != "") {
            shot.Share.shareKeywordReplace.boxId = result.boxId;
        }
        var _config = shot.GameWorld.gunnerShareSchemeConfig;
        if (_config && _config.boxShareGetProp && !ty.UserInfo.isInBSGS){
            this.btnText.string = "<color=#ffffff><b><size=44>分享到群领道具</b></color>";
            this.tips.node.active = false;
        }else{
            this.tips.string = "自己也可以进群抢道具哦";
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
        }else if (this.state == 1) {    // 手榴弹
            // ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["propBoxLaserShare"]);
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["propBoxGrenadeShare"]);
            if (_config && _config.boxShareGetProp && !ty.UserInfo.isInBSGS){
                shot.Share.shareWithType(shot.Share.onShareType.clickStatShareTypeGrenadeGetReward);
            }else {
                shot.Share.shareWithType(shot.Share.onShareType.clickStatShareTypeGrenade);
            }
        }else if(this.state == 2){
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["doubleHitContinue"]);
            shot.Share.shareWithType(shot.Share.onShareType.clickStatShareTypeComboContinue);
        }
    },

    onClose:function(){
        if(this.state == 2){
            shot.GameWorld.doubleHitCountDownTime = true;
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
