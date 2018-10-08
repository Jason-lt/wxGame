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
        textRich : {
            default : null,
            type : cc.RichText
        }
    },
    onLoad : function() {
        if(shot.gameModel.getAllCheckConfig()){
            this.textRich.string = "<color=#ffffff><b>开启</b></color>";
        }else {
            if(ty.UserInfo.isInBSGS ){
                this.textRich.string = "<color=#ffffff><b>"+shot.GameWorld.treasureConfig.showAtWindow.bsgs.text+"</b></color>";
            }else {
                this.textRich.string = "<color=#ffffff><b>"+shot.GameWorld.treasureConfig.showAtWindow.nBsgs.text+"</b></color>";
            }
        }
        ty.NotificationCenter.listen(shot.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
    },

    onClose : function () {
        this.node.destroy();
    },
    onOpenBox : function () {
        if(shot.gameModel.getAllCheckConfig()){
            this.changeStateToGet();
            return;
        }
        if(ty.UserInfo.isInBSGS){
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["openBoxB"]);
            if(shot.GameWorld.treasureConfig.showAtWindow.bsgs.share){
                shot.Share.shareWithType(shot.Share.onShareType.clickStatShareTypeOpenSecretBoxB);
            }else {
                this.changeStateToGet();
            }
        }else {
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["openBoxN"]);
            if(shot.GameWorld.treasureConfig.showAtWindow.nBsgs.share){
                shot.Share.shareWithType(shot.Share.onShareType.clickStatShareTypeOpenSecretBoxN);
            }else {
                this.changeStateToGet();
            }
        }
    },

    playAnimationAfterShareWithType : function (shareType) {
        // // //TODO:TEST
        // this.changeStateToGet();

        if (shareType && (shareType == shot.Share.onShareType.clickStatShareTypeOpenSecretBoxB ||
            shareType == shot.Share.onShareType.clickStatShareTypeOpenSecretBoxN)) {
            var reultType = shot.Share.resultType;
            switch (reultType) {
                case 1:
                    hall.MsgBoxManager.showToast({title : '分享到群才有效哦~'});
                    break;
                case 2:
                    hall.MsgBoxManager.showToast({title : '这个群今天已经打扰过了哦~'});
                    break;
                case 3:
                    this.changeStateToGet();
                    break;
                case 6:
                    hall.MsgBoxManager.showToast({title : '分享失败'});
                    break;
                default:
                    break;
            }
        }
        shot.Share.resultType = 0;
    },

    changeStateToGet : function () {
        var rewardConfig = shot.GameWorld.treasureConfig.rewardConfig["treasureBox"];
        var rand = Math.random();
        var rewardType;
        if(rand <= rewardConfig.laserGun){
            rewardType = "laserGun";
        }else if(rand <= rewardConfig.laserGun + rewardConfig.infiniteBullet){
            rewardType = "infiniteBullet";
        }else if(rand <= rewardConfig.laserGun + rewardConfig.infiniteBullet + rewardConfig.doubleGun){
            rewardType = "doubleGun";
        }else {
            rewardType = "shotGun";
        }

        if(rewardType == "laserGun"){
            shot.gameModel.shareToGetreward(10600002);//获得激光瞄准器
        }else if(rewardType == "infiniteBullet"){
            shot.gameModel.shareToGetreward(10600001);//获得无限子弹
        }else if(rewardType == "doubleGun"){
            shot.GlobalFuncs.playGetPropBoxAni(2,shot.GameWorld.propertyConfig[rewardType].bulletType);
            shot.GlobalFuncs.setBulletType(shot.GameWorld.propertyConfig[rewardType].bulletType);
        }else if(rewardType == "shotGun"){
            shot.GlobalFuncs.playGetPropBoxAni(3,shot.GameWorld.propertyConfig[rewardType].bulletType);
            shot.GlobalFuncs.setBulletType(shot.GameWorld.propertyConfig[rewardType].bulletType);
        }
        this.node.destroy();

    },
    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
        // this.unscheduleAllCallbacks();
    }
    // LIFE-CYCLE CALLBACKS:



    // start () {
    //
    // },

    // update (dt) {},
});
