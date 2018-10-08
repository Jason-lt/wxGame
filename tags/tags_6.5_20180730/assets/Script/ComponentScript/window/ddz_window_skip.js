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
        titleLabel:cc.Label,
        contentRichtext:cc.RichText,
        centerButton:cc.Button,
        ignoreButton:cc.Button,
    },

    onLoad:function(){
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
    },
    playAnimationAfterShareWithType : function (type) {
        if (type && type == ddz.Share.onShareType.clickStatShareTypeSkipCustom ||
            type == ddz.Share.onShareType.clickStatShareTypeSkipCustomNewer) {
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
                    this.onClose();
                    if (this.skipCustom > 0){
                        ddz.matchModel.matchBackNextLevel(null,null,this.skipCustom);
                    }
                    break;
                default:
                    break;
            }
        }

        ddz.Share.resultType = 0;
    },

    updateWindowInfo:function(state){
        this.state = state;
        this.skipCustom = 0;
        var bc = ddz.gameModel.getSkipCustomsConfigJson();
        hall.GlobalFuncs.setInLocalStorage(ddz.gameModel.CONTINUOUSLOGIN, true);
        hall.GlobalFuncs.setInLocalStorage(ddz.gameModel.YESTERDAYSHARE, true);
        if (state == 1){    // 新用户跳关
            this.titleLabel.string = "打的不错,送你新人专享权利";
            var count = 7;
            if (bc && bc.newCustoms) {
                count = bc.newCustoms;
                this.skipCustom = bc.newCustoms;
            }

            this.contentRichtext.string = "<color=#1A6951>分享到群直接挑战第"+ count +"关</c><br/><color=#1A6951>获胜就能拿红包</c><color=#FD5051> (最高100元)</c>";
            this.ignoreButton.node.active = false;
            this.centerButton.node.y = -120;
        }else if (state == 2){  //老用户连续登录
            this.titleLabel.string = "连续登录奖励";
            var count = 4;
            if (bc && bc.oldCustoms) {
                count = bc.oldCustoms;
                this.skipCustom = bc.oldCustoms;
            }
            this.contentRichtext.string = "<color=#1A6951>分享到群直接挑战第"+ count +"关</c>";
            this.ignoreButton.node.active = true;
            this.centerButton.node.y = -83;
            
        }else if (state == 3){  //老用户回归
            this.titleLabel.string = "欢迎回来,回归奖励";
            var count = 4;
            if (bc && bc.oldCustoms) {
                count = bc.oldCustoms;
                this.skipCustom = bc.oldCustoms;
            }
            this.contentRichtext.string = "<color=#1A6951>分享到群直接挑战第"+ count +"关</c>";
            this.ignoreButton.node.active = true;
            this.centerButton.node.y = -83;
        }
    },

    onClickCenterBtn:function(){
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,
            ["onSkipCustomShare",this.state]);
        if (this.state == 1) {
            ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeSkipCustomNewer);
        }else {
            ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeSkipCustom);
        }
    },

    onClickIgnoreBtn:function(){
        ddz.matchModel.startMatchProgress();
        this.onClose();
    },

    onClose:function(){
        this.node.destroy();
    },
    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
    },
});
