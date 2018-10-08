// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        banner:cc.Node,
        betRich:cc.RichText,
        shareRedPacket:cc.Prefab,
        panel:cc.Node,
        btnText:cc.RichText,
        personalAssets : cc.Node,

        diamondNode:cc.Node,
        videoNode:cc.Node,

        videoBtnSpr:cc.Sprite,
        diamondBntSpr:cc.Sprite,

        btnSpriteFrame:[cc.SpriteFrame],

        videoBtnText:cc.RichText,
        diamondBntText:cc.RichText,

        seeVideoBtn:cc.Button,
        shareBtn:cc.Button,

        videoButtonText:cc.RichText,

        redDot:cc.Node,

    },

    onLoad:function(){
        var that = this;
        // this.scheduleOnce(function () {
        //     var ani = that.banner.getComponent(cc.Animation);
        //     ani.play('btnTick');
        // }, 1);

        hall.GlobalFuncs.btnScaleEffect(this.seeVideoBtn.node,1.13);
        hall.GlobalFuncs.btnScaleEffect(this.shareBtn.node,1.13);
        this.betRich.node.active = false;
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
        ty.NotificationCenter.listen(ddz.EventType.REMOVE_WINDOW_ANI, this.onClose, this);

        ty.NotificationCenter.listen(ddz.EventType.UPDATE_WATCH_VIDEO_STATUS, this.updateWatchVideoState,this);
        ty.NotificationCenter.listen(ddz.EventType.REWARD_VIDEO_COMPLETE,this.finishShowRewardVideo,this);
        ty.NotificationCenter.listen(ddz.EventType.REWARD_VIDEO_COMPLETE_ERROR,this.errorShowRewardVideo,this);
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_VIDEO_REWARD,this.finishGetRewardVideo,this);
        var _shareType = ddz.Share.onShareType.clickStatShareTypeGetDiamondHall;
        this.btnText.string = "<color=#E54D42>"+ hall.GlobalFuncs.getButtonTitle(_shareType) +"</c>";
        ddz.gameModel.queryWatchVideoReward();
        this.setPersonalAssets();

        this.canPlayVideo = true;
    },

    setPersonalAssets:function () {
        // 个人财产信息
        var wimdow = this.personalAssets.getComponent("personalAssets");
        wimdow.updateInfo();
    },

    playAnimationAfterShareWithType : function (type) {
        if (type && type != ddz.Share.onShareType.clickStatShareTypeGetDiamondHall) {
            return;
        }
        var reultType = ddz.Share.resultType;
        switch (reultType) {
            case 1:
                if (!ddz.gameModel.isBringVersion) {
                    hall.MsgBoxManager.showToast({title : '请分享到微信群哦~'});
                }
                break;
            case 2:
                if (!ddz.gameModel.isBringVersion) {
                    hall.MsgBoxManager.showToast({title : '请不要频繁分享到一个群~'});
                }
                break;
            case 3:

                break;
            default:
                break;
        }

        ddz.Share.resultType = 0;
    },

    updateWindowInfo:function(state){
        if (state == 1) {   //钻石
            this.diamondNode.active = true;
            this.videoNode.active = false;
            this.diamondBntSpr.spriteFrame = this.btnSpriteFrame[0];
            this.diamondBntText.string = "<color=#ffffff>钻石红包</c>";
            this.videoBtnSpr.spriteFrame = this.btnSpriteFrame[1];
            this.videoBtnText.string = "<color=#9C7343>看视频</color>";
            this.redDot.active = false;
        }else if (state == 2) { //看视频
            this.diamondNode.active = false;
            this.videoNode.active = true;
            this.diamondBntSpr.spriteFrame = this.btnSpriteFrame[1];
            this.diamondBntText.string = "<color=#9C7343>钻石红包</c>";
            this.videoBtnSpr.spriteFrame = this.btnSpriteFrame[0];
            this.videoBtnText.string = "<color=#ffffff>看视频</color>";
        }
    },

    onShareBtn:function(){
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,
            ["diamondShare"]);
        ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeGetDiamondHall);
    },


    updateWatchVideoState : function (result) {
        this.adId = result.videoId;
        if(result.status == 0){
            this.canPlayVideo = false;
            this.mail = result.mail;
            this.videoButtonText.string = "<color=#ED4824>看视频领取("+ result.times[0] +"/"+ result.times[1]+")</c>";
        }else if(result.status == 1){
            this.videoButtonText.string = "<color=#ED4824>看视频领取("+ result.times[0] +"/"+ result.times[1]+")</c>";
            this.canPlayVideo = true;

        }
    },
    finishShowRewardVideo : function (isEnded) {
        if(isEnded){
            ddz.gameModel.getWatchVideoReward();
            ddz.gameModel.queryWatchVideoReward();
        }
        // this.playRideo = false;
    },
    errorShowRewardVideo : function (parArr) {
        this.finishShowRewardVideo(parseInt(parArr[1]))
    },

    finishGetRewardVideo : function (result) {
        if(result.rewards){
            var rewards = result.rewards;
            if(rewards.itemId == "item:1311"){
                ddz.GlobalFuncs.playZuanShi(false,this,rewards.count,false);
            }else {
                ddz.GlobalFuncs.playZuanShi(false,this,rewards.count,true);
            }
        }else {
            if (result.mail) {
                hall.MsgBoxManager.showToast({title : result.mail});
            }
        }
        this.videoButtonText.string = "<color=#ED4824>看视频领取("+ result.times[0] +"/"+ result.times[1]+")</c>";
    },


    onClcikSeeVideoBtn:function(){
        if (ty.TCP.connectStatus != ty.TCP.CONNECT_STATUS_OK){
            hall.MsgBoxManager.showToast({title : "正在登录，请稍候"});
            ddz.LOGD(null, "TCP is not ok! Please wait!");
            return;
        }

        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,
            ["watchVideo","diamond"]);

        if (this.canPlayVideo) {
            hall.adManager.showRewardedVideo(this.adId,"diamond");
        }else {
            if (this.mail){
                hall.MsgBoxManager.showToast({title : this.mail});
            }
        }
    },

    onClickDiamondBtn:function(){
        this.updateWindowInfo(1);
    },

    onClickVideoBtn:function(){
        this.updateWindowInfo(2);
    },

    updateShareInfo:function(data){
        if (data.newUserMulti){
            this.setBtnRichText(data.newUserMulti);
        }
        ty.NotificationCenter.trigger(ddz.EventType.UPDATE_REWARD_COUNT,data);
        if (data.inviteeList && data.inviteeList.length > 0) {
            var that = this;
            var _index = 0;
            var _inviteeList = data.inviteeList;
            var runOneFun = function () {

                if (_index < 5) {
                    if (_inviteeList.length > 0){
                        var _playerData = _inviteeList.shift();
                        if (that["shareRedPacket_"+_index]) {
                            var com = that["shareRedPacket_"+_index].getComponent('shareRedPacket');
                            com.setSharePeopleInfo(_playerData);
                        }else {
                            that["shareRedPacket_"+_index] = cc.instantiate(that.shareRedPacket);

                            that.panel.addChild(that["shareRedPacket_"+_index]);
                            var com = that["shareRedPacket_"+_index].getComponent('shareRedPacket');
                            com.setSharePeopleInfo(_playerData);
                        }
                    }

                }else if (_index == 5){
                    if (data.bigReward) {
                        if (that.bigWindow) {
                            var com = that.bigWindow.getComponent('shareRedPacket');
                            if (com) {
                                com.setBigReward(data.bigReward);
                            }
                        }else {
                            that.bigWindow = cc.instantiate(that.shareRedPacket);
                            that.panel.addChild(that.bigWindow);
                            var com = that.bigWindow.getComponent('shareRedPacket');
                            com.setBigReward(data.bigReward);
                        }

                    }
                }
                _index++;
                requestAnimationFrame(runOneFun);
            };
            runOneFun();
        }
        
        ty.NotificationCenter.trigger(ddz.EventType.UPDATE_REWARD_COUNT,data);
    },

    setBtnRichText:function(_bet) {
        if (_bet > 0) {
            this.betRich.node.active = true;
            this.betRich.string = "<color=#9C7343>新玩家点击，可获得</c><color=#ED4824><size=30>" + _bet + "倍奖励</color>";
        }
    },

    removeLoopAni:function () {
        var ani = this.banner.getComponent(cc.Animation);
        ani.stop();

        this.seeVideoBtn.node.stopAllActions();
        this.shareBtn.node.stopAllActions();
    },

    shut:function () {
        this.removeLoopAni();
        this.node.destroy();
    },

    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
    },

    onClose:function(){
        this.shut();
        ddz.ddz_dayWelfare = null;
    },
});
