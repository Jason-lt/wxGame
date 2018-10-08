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
        shareTips:cc.Node,
        aniSpriteNode :{
            default : null,
            type : cc.Node
        }
    },

    onLoad:function(){
        hall.GlobalFuncs.btnScaleEffect(this.centerBtn.node,1.13);
        this.scoreLabel.string = shot.GameWorld.totalScore;
        shot.Share.shareKeywordReplace.theScoreForNow = shot.GameWorld.totalScore;
        var userDataList = JSON.parse(shot.GameWorld.game_friendData);
        var haveNext = false;
        var haveSelf = false;
        if (userDataList && userDataList.length){
            for (var i = userDataList.length-1; i >= 0; i--){
                var user = userDataList[i];
                var score = user.sumScore;
                if (user.userId == ty.UserInfo.userId){
                    haveSelf = true;
                    if(score < shot.GameWorld.totalScore && ty.UserInfo.userId != 0){
                        shot.GlobalFuncs.upDateRankData(shot.GameWorld.totalScore);
                        shot.Share.shareKeywordReplace.bestScoreForSelf = shot.GameWorld.totalScore + "";
                    }else {
                        shot.Share.shareKeywordReplace.bestScoreForSelf = score + "";
                    }
                }
                if(!haveNext && score > shot.GameWorld.totalScore && user.userId != ty.UserInfo.userId){
                    haveNext = true;
                    this.nextScoreLabel.string = score + "分";
                    if(user.avatarUrl && user.avatarUrl != ""){
                        ty.SystemInfo.getImageWithURL(user.avatarUrl,this.nextAvatar);
                    }else {
                        ty.SystemInfo.getImageWithURL("res/raw-assets/resources/table/nopack/rank_avatar_default.png",this.nextAvatar);
                    }
                }
            }
        }else if(ty.UserInfo.userId != 0){
            shot.GlobalFuncs.upDateRankData(shot.GameWorld.totalScore);
            shot.Share.shareKeywordReplace.bestScoreForSelf = shot.gameModel.totalScore + "";
        }

        if(!haveNext){
            this.nextNode.active = false;
        }
        if(!haveSelf && ty.UserInfo.userId != 0){
            shot.Share.shareKeywordReplace.bestScoreForSelf = shot.GameWorld.totalScore + "";
        }

        if(!ty.UserInfo.wxgame_session_key){
            hall.LoginToyoo();
        }

        var count = hall.ME.udataInfo.diamondCount || 0;
        this.diamondLabel.string = "<color=#622508>已有 </color><img src='shot_gift_diamond'/><color=#FF3333> x"+ count +"</color>";
        if (count == 0){
            this.centerBtnText.string = "没有钻石";
            this.state = 1;
        }else {
            this.centerBtnText.string = "使用钻石";
            this.state = 0;
        }
        ty.NotificationCenter.listen(shot.EventType.RESURGENCE_RESULT,this.getResurgenceResult ,this);
        ty.NotificationCenter.listen(shot.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
        ty.NotificationCenter.listen(shot.EventType.UPDATE_DIAMOND_NUMBER,this.updateDiamond, this);
        this.updateTips();
    },

    //
    updateTips:function(){
        var _config = shot.GameWorld.gunnerShareSchemeConfig;
        if (_config && _config.resurgenceShare && !ty.UserInfo.isInBSGS){
            this.useDiamondTips.active = false;
            this.shareTips.active = true;
            this.centerBtnText.string = "分享到群复活";
        }else{
            this.useDiamondTips.active = true;
            this.shareTips.active = false;
        }
    },

    playAnimationAfterShareWithType : function (shareType) {
        if (shareType && shareType == shot.Share.onShareType.clickStatShareTypeRevial) {
            var _config = shot.GameWorld.gunnerShareSchemeConfig;
            if (_config && _config.resurgenceShare && !ty.UserInfo.isInBSGS){
                var reultType = shot.Share.resultType;
                switch (reultType) {
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
        var _config = shot.GameWorld.gunnerShareSchemeConfig;
        if (_config && _config.resurgenceShare && !ty.UserInfo.isInBSGS){
            return
        }

        var count = hall.ME.udataInfo.diamondCount || 0;
        this.diamondLabel.string = "<color=#622508>已有 </color><img src='shot_gift_diamond'/><color=#FF3333> x"+ count +"</color>";
        if (count == 0){
            this.centerBtnText.string = "没有钻石";
            this.state = 1;
        }else {
            this.centerBtnText.string = "使用钻石";
            this.state = 0;
        }
    },
    getResurgenceResult:function(resurt){
        if (resurt.success == 1 && resurt.itemId == "item:1373"){   //复活成功
            this.onClose();
            //复活
            ty.NotificationCenter.trigger(shot.EventType.GAME_START);
            hall.MsgBoxManager.showToast({title:'复活成功!'});
        }else{  //复活失败
        }
    },

    onClickCenterButton:function(){
        var _config = shot.GameWorld.gunnerShareSchemeConfig;
        if (_config && _config.resurgenceShare && !ty.UserInfo.isInBSGS){
            shot.Share.shareWithType(shot.Share.onShareType.clickStatShareTypeRevial);
            return
        }
        if (this.state == 1){
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["noDiamond"]);
            hall.MsgBoxManager.showToast({title:'邀请好友进入游戏可得钻石!'});
            return
        }
        //使用复活卡
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["useDiamond"]);
        shot.gameModel.consumeAssets(1,"item:1373");
    },

    onClose:function(){
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["onCloseResurgence"]);
        this.centerBtn.node.stopAllActions();
        this.node.destroy();
    },

    onClickSkip:function(){
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["onClickSkip"]);
        this.onClose();
        //跳转结算页面
        shot.GlobalFuncs.showGameOverWithMyScore();
    },
    secretGift : function () {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["secretGift"]);
        shot.GlobalFuncs.showMysteryGifgBag();
    },
    update :function(dt) {
        this.aniSpriteNode.rotation += 1;
    },

    onDestroy:function(){
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }


});
