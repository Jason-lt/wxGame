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
        scoreLabel:cc.Label,
        diamondLabel:cc.RichText,
        centerBtn:cc.Button,
        centerBtnText:cc.RichText,

        nextNode:cc.Node,
        nextAvatar:cc.Sprite,
        nextScoreLabel:cc.Label,
        useDiamondTips:cc.Node,
        // shareTips:cc.Node,
        aniSpriteNode :{
            default : null,
            type : cc.Node
        },
        diamondNode : {
            default : null,
            type : cc.Button
        }
    },

    onLoad:function(){
        hall.GlobalFuncs.btnScaleEffect(this.centerBtn.node,1.13);
        this.scoreLabel.string = shot.GameWorld.totalScore;
        shot.Share.shareKeywordReplace.theScoreForNow = shot.GameWorld.totalScore;

        this.nextNode.active = false;

        if(!ty.UserInfo.wxgame_session_key){
            hall.LoginToyoo();
        }

        var count = hall.ME.udataInfo.diamondCount || 0;
        this.diamondLabel.string = "<color=#622508>已有 </color><img src='shot_gift_diamond'/><color=#FF3333> x"+ count +"</color>";
        if (count == 0){
            this.centerBtnText.string = "没有钻石";
            this.state = 1;
        }else {
            this.centerBtnText.string = "复活";
            this.state = 0;
        }
        ty.NotificationCenter.listen(shot.EventType.RESURGENCE_RESULT,this.getResurgenceResult ,this);
        ty.NotificationCenter.listen(shot.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
        ty.NotificationCenter.listen(shot.EventType.UPDATE_DIAMOND_NUMBER,this.updateDiamond, this);
        ty.NotificationCenter.listen(shot.EventType.REWARD_VIDEO_COMPLETE,this.rewardVideoComplete, this);
        ty.NotificationCenter.listen(shot.EventType.REWARD_VIDEO_COMPLETE_ERROR,this.rewardVideoCompleteError, this);
        this.updateTips();
        this.changeDiamondNodeActive();
        hall.adManager.showBannerAd("adunit-53ba999759aa14de");

        shot.GlobalFuncs.showAdBtnWithTag(5003,"resurgence");
    },

    changeDiamondNodeActive : function () {
        if(shot.gameModel.getAllCheckConfig()){
            this.diamondNode.node.active = false;
        }else {
            if(ty.UserInfo.isInBSGS){
                this.diamondNode.node.active = shot.GameWorld.toolUserTimeConfig.mysteryShow.bsgs;
            }else {
                this.diamondNode.node.active = shot.GameWorld.toolUserTimeConfig.mysteryShow.nBsgs;
            }
        }
    },

    //
    updateTips:function(){
        var reTypeList ;
        if(ty.UserInfo.isInBSGS){
            reTypeList = shot.GameWorld.toolUserTimeConfig.resurgenceType.bsgs;
        }else {
            reTypeList = shot.GameWorld.toolUserTimeConfig.resurgenceType.nBsgs;
        }
        if(reTypeList[0] == "ad"){
            if(hall.adManager.canPlay){
                this.useDiamondTips.active = false;
                this.centerBtnText.string = "<color=#ffffff><b>观看视频复活</b></color>";
                this.scoreLabel.node.y = 57;
                this.state = 3;
            }else if(reTypeList.length > 1 &&  (reTypeList[1] == "share" || reTypeList[1] == "shareRec")){
                if(reTypeList[1] == "shareRec"){
                    shot.gameModel.shareRec = true;
                }
                this.useDiamondTips.active = false;
                this.centerBtnText.string = "<color=#ffffff><b>免费复活</b></color>";
                this.scoreLabel.node.y = 57;
                this.state = 2;
            }else {
                this.useDiamondTips.active = true;
                this.scoreLabel.node.y = 130;
            }
        }else if(reTypeList[0] == "share" || reTypeList[0] == "shareRec"){
            if(reTypeList[0] == "shareRec"){
                shot.gameModel.shareRec = true;
            }
            var number = hall.GlobalFuncs.getRandomNumberBefore(100);
            var tempNumber;
            if(ty.UserInfo.isInBSGS){
                tempNumber = shot.GameWorld.toolUserTimeConfig.resurgenceType.shareProbabilityB;
            }else {
                tempNumber = shot.GameWorld.toolUserTimeConfig.resurgenceType.shareProbabilityN;
            }
            if(number < tempNumber){
                this.useDiamondTips.active = false;
                this.centerBtnText.string = "<color=#ffffff><b>免费复活</b></color>";
                this.scoreLabel.node.y = 57;
                this.state = 2;
            }else {
                if(hall.adManager.canPlay){
                    this.useDiamondTips.active = false;
                    this.centerBtnText.string = "<color=#ffffff><b>观看视频复活</b></color>";
                    this.scoreLabel.node.y = 57;
                    this.state = 3;
                }else {
                    this.useDiamondTips.active = true;
                    this.scoreLabel.node.y = 130;
                }
            }
        }else {
            this.useDiamondTips.active = true;
            this.scoreLabel.node.y = 130;
        }
    },

    playAnimationAfterShareWithType : function (shareType) {
        if (shareType && shareType == shot.Share.onShareType.clickStatShareTypeRevial) {
            if(!shot.gameModel.shareTimeEnough){
                hall.MsgBoxManager.showToast({title : '换个群试试吧'});
                return;
            }
            var _config = shot.GameWorld.gunnerShareSchemeConfig;
            if (_config && _config.resurgenceShare){
            // if (_config && _config.resurgenceShare && !ty.UserInfo.isInBSGS){
                var resultType = shot.Share.resultType;
                switch (resultType) {
                    case 1:
                        hall.MsgBoxManager.showToast({title : '分享到群才有效哦~'});
                        break;
                    case 2:
                        hall.MsgBoxManager.showToast({title : '这个群今天已经打扰过了哦~'});
                        break;
                    case 3:
                        shot.waitGetRevial = {
                            type : 'waitRecive'
                        };
                        //发送得钻石的消息
                        shot.gameModel.shareToGetreward(shot.waitGetRevial.sharePoint || shot.Share.SharePointType.shareResurgence);
                        break;
                    default:
                        break;
                }
            }else {
                hall.MsgBoxManager.showToast({title : "快进群抢礼包吧~"});
            }
            shot.Share.resultType = 0;
        }
    },

    updateDiamond : function () {
        if( this.state == 3 || this.state == 2){
            return;
        }

        var count = hall.ME.udataInfo.diamondCount || 0;
        this.diamondLabel.string = "<color=#622508>已有 </color><img src='shot_gift_diamond'/><color=#FF3333> x"+ count +"</color>";
        if (count == 0){
            this.centerBtnText.string = "没有钻石";
            this.state = 1;
        }else {
            this.centerBtnText.string = "复活";
            this.state = 0;
        }
    },

    onBlack : function () {

    },
    getResurgenceResult:function(resurt){
        if (resurt.success == 1 && resurt.itemId == "item:1373"){   //复活成功
            hall.adManager.hideBannerAd();
            this.onClose();
            //复活
            ty.NotificationCenter.trigger(shot.EventType.GAME_START);
            hall.MsgBoxManager.showToast({title:'复活成功!'});
        }else{  //复活失败
            hall.MsgBoxManager.showToast({title:'复活失败!'});
        }
    },
    rewardVideoComplete : function(isEnd){
        if(hall.adManager.rewardedVideoType != "resurgence"){
            return;
        }
        if(isEnd){
            hall.adManager.hideBannerAd();
            this.onClose();
            //复活
            ty.NotificationCenter.trigger(shot.EventType.GAME_START);
            hall.MsgBoxManager.showToast({title:'复活成功!'});
        }else {
            hall.MsgBoxManager.showToast({"title":"视频播放未完成"});
        }
    },
    rewardVideoCompleteError : function (errorMsg) {
        if(hall.adManager.rewardedVideoType != "resurgence"){
            return;
        }
        hall.MsgBoxManager.showToast({"title":errorMsg});
    },
    onClickCenterButton:function(){
        shot.GlobalFuncs.hideAdBtnWithTag(5003,true);
        if (this.state == 2){
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["resurgenceShare"]);
            // shot.gameModel.shareRec = shot.GameWorld.toolUserTimeConfig.resurgenceType.shareRec;
            shot.Share.shareWithType(shot.Share.onShareType.clickStatShareTypeRevial);
            return;
        }

        if (this.state == 1){
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["noDiamond"]);
            hall.MsgBoxManager.showToast({title:'邀请好友进入游戏可得钻石!'});
            return;
        }
        if (this.state == 3){
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["resurgenceAd"]);
            hall.adManager.showRewardedVideo("resurgence");
            return;
        }
        //使用复活卡
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["useDiamond"]);
        shot.gameModel.consumeAssets(1,"item:1373");
    },

    onClose:function(){
        shot.GlobalFuncs.hideAdBtnWithTag(5003,true);
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["onCloseResurgence"]);
        this.centerBtn.node.stopAllActions();
        this.node.destroy();
    },

    onClickSkip:function(){
        shot.GlobalFuncs.hideAdBtnWithTag(5003,true);
        hall.adManager.hideBannerAd();
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["onClickSkip"]);
        this.onClose();
        //跳转结算页面
        shot.GlobalFuncs.showGameOverWithMyScore();
    },
    secretGift : function () {
        shot.GlobalFuncs.hideAdBtnWithTag(5003,true);
        hall.adManager.hideBannerAd();
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["secretGift"]);
        shot.GlobalFuncs.showMysteryGifgBag();
    },
    update :function(dt) {
        this.aniSpriteNode.rotation += 1;
    },

    onDestroy:function(){
        // shot.GlobalFuncs.hideAdBtnWithTag(5003,true);
        hall.adManager.hideBannerAd();
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }


});
