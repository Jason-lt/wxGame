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
        useDiamaond : {
            default : null,
            type : cc.Node
        },
        daylyWork : {
            default : null,
            type : cc.Node
        },
        backButton : {
            default : null,
            type : cc.Button
        },
        isOnShareAction : false,
        sahreRichText : cc.RichText,
        tableView : {
            default : null,
            type : cc.Node
        },
        getDayRewardRichText : cc.RichText,
        getDayRewardButton : cc.Button,

        haveCountTipsLabel : cc.Label,
        haveCountRichText : cc.RichText,

        day :"",

        aniRichText : cc.RichText,
        lastCount : 0
    },
    backAction : function () {
        ddz.LOGD(null, "backAction");
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.back_button_click_sound, false);
        var window = this.useDiamaond.getComponent("ddz_useDiamond");
        window.setActiveForFalseBack();
        var sceneName = 'Ddz';
        cc.director.loadScene(sceneName);
    },
    setDetailWithDiamondCount:function(type,state,guan) {
        if(type == 1){
            this.useDiamaond.active = true;
            this.daylyWork.active = false;
            var window = this.useDiamaond.getComponent("ddz_useDiamond");
            window.setDetailWithDiamondCount(type,state,guan);
            window.parentScene = this;
        }else {
            this.useDiamaond.active = false;
            this.daylyWork.active = true;
            this.setDayLyWork();
        }
    },
    setActiveForFalse : function () {
        this.backButton.node.active = false;
    },

    onLoad :function() {
        ddz.GlobalFuncs.drawGameCanvas();
        var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        if (backButtonH){
            this.backButton.node.y = backButtonH;
        }
    },

    setDayLyWork : function () {
        //分享到群奖励
        this.setShareCountRichText();

        //邀请奖励
        // var window = this.tableView.getComponent('ddz_tableView');
        // window.setDataArray(ddz.gameModel.inviteShowList);
        ddz.gameModel.queryInviteInfo();
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_REWARD_MASSAGE, this.updateRewardMassage, this);

        //今日领取奖励
        this.setDayLoginState();

        ty.NotificationCenter.listen(ddz.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_DIAMOND_COUNT, this.playAnimationAftergetReward, this);
        ty.NotificationCenter.listen(ty.EventType.GET_DIAMOND,this.getDiamondNotification ,this);
    },

    //分享到群
    shareButtonAction : function () {
        if(!this.isOnShareAction){
            ddz.Share.shareWithType(ddz.Share.clickStatShareType.clickStatShareTypeGetDiamondHall);
            this.isOnShareAction = true;
        }
    },
    playAnimationAfterShareWithType : function () {
        this.setShareCountRichText();
        var type = ddz.Share.resultType;
        switch (type) {
            case 1:
                ddz.GlobalFuncs.showTipsWindowWithString("只有分享到微信群才有效哦~",this);
                break;
            case 2:
                ddz.GlobalFuncs.showTipsWindowWithString("这个群已经分享过啦，分享到其他群吧",this,"分享到群");
                break;
            case 3:
                // ddz.GlobalFuncs.playZuanShi();
                break;
            default:
                break;
        }
        ddz.Share.resultType = 0;
        this.isOnShareAction = false;
    },
    setShareCountRichText : function () {
        // var toDay = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.Share.TODAY_TIME, "");
        var toDay = hall.GlobalTimer.getCurDay();
        var lastShareTime = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.Share.LAST_SHARE_TIME, "");
        var count =  0;
        if(toDay == lastShareTime){
            var shareTickets = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.Share.SHARETICKETS_LIST, "");
            var shareMap = JSON.parse(shareTickets);
            var keyS = '67890002';
            if(!shareMap[keyS]){
                count = 0;
            }else {
                var list = shareMap[keyS];
                count = list.length;
            }
        }
        var showCount = count>3?3:count;

        var lossCount = 1;

        this.sahreRichText.string = "<color=#1A6951><size=36>分享到群（"+showCount+"/3）</size><br/><size=30>奖励：" +
            "<img src='dda_button_diamond_black' height=34 width=42/> +"+lossCount+"</size></color>";

        this.changeDiamondCount();
    },
    getDiamondNotification : function () {
        ddz.GlobalFuncs.playZuanShi(null,this);
    },
    getDiamondAniFinish : function () {
        this.changeDiamondCount();
    },

    //邀请得钻石
    updateRewardMassage : function () {
        ty.NotificationCenter.ignore(ddz.EventType.UPDATE_REWARD_MASSAGE, this.updateRewardMassage, this);
        this.setShareCountRichText();
        var window = this.tableView.getComponent('ddz_tableView');
        // var list = [{"userId":92563,"name":"狐说魃道",
        //     "pic":"https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIRYXHlGLzuup1W2T1S0J3xJmeJbvTEgpSD9oAHlPE3FC0BQvfyTKsqIicNzmfxZGyUFjMDeEO3vXA/0",
        //     "rewardState":1,"bindRewardCount":1,"count":1,"nowCount":0},
        //     {"pic":"","rewardState":1,"count":2,"userId":0,"name":"玩家","nowCount":0,"bindRewardCount":1},
        //     {"pic":"","rewardState":1,"count":3,"userId":0,"name":"玩家","nowCount":0,"bindRewardCount":1},
        //     {"pic":"","rewardState":1,"count":4,"userId":0,"name":"玩家","nowCount":0,"bindRewardCount":1},
        //     {"pic":"","rewardState":1,"count":5,"userId":0,"name":"玩家","nowCount":0,"bindRewardCount":1},
        //     {"pic":"","rewardState":1,"count":6,"userId":0,"name":"玩家","nowCount":0,"bindRewardCount":2},
        //     {"pic":"","rewardState":1,"count":7,"userId":0,"name":"玩家","nowCount":0,"bindRewardCount":2},
        //     {"pic":"","rewardState":1,"count":8,"userId":0,"name":"玩家","nowCount":0,"bindRewardCount":2},
        //     {"pic":"","rewardState":1,"count":9,"userId":0,"name":"玩家","nowCount":0,"bindRewardCount":2},
        //     {"pic":"","rewardState":1,"count":10,"userId":0,"name":"玩家","nowCount":0,"bindRewardCount":2}];
        //
        // window.setDataArray(list);
        window.setDataArray(ddz.gameModel.inviteShowList);
    },
    playAnimationAftergetReward : function (value) {
        this.aniRichText.node.active = true;
        if(!value){
            value = 1;
        }
        this.aniRichText.string = "<img src='dda_button_diamond_black' height=34 width=42/><color=#1A6951> +"+value+"<c/>";
        var animation = this.aniRichText.getComponent(cc.Animation);
        var anim1 = animation.getAnimationState('richAni');
        anim1.on('finished', this.completeAni,this);
        anim1.play();
    },
    completeAni : function () {
        this.aniRichText.node.active = false;
        this.changeDiamondCount();
    },

    //每日登录
    getDayRewardAction : function (event) {
        ddz.gameModel.getDayLoginReward();
        this.getDayRewardButton.interactable = false;
        ty.NotificationCenter.listen(ddz.EventType.DAY_LOGIN_REWARD,this.getDayLoginRewardresult,this);
    },
    getDayLoginRewardresult : function (result) {
        if(parseInt(result.count) != 0){
            ty.NotificationCenter.trigger(ddz.EventType.UPDATE_DIAMOND_COUNT,result.count+"");
        }else {
            hall.MsgBoxManager.showToast({"title":result.msg});
        }
        var dayGetStateString = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.gameModel.LAST_GETDAYREWARD_TIME, "");
        var dayGetStateDic = JSON.parse(dayGetStateString);
        var dayGetStateList = dayGetStateDic[this.day];
        var nowHour = hall.GlobalTimer.getCurHours();
        dayGetStateList.push(nowHour);
        hall.GlobalFuncs.setInLocalStorage(ddz.gameModel.LAST_GETDAYREWARD_TIME, JSON.stringify(dayGetStateDic));
        this.setDayLoginState();
    },
    setNowDayGetRewardRecord : function () {
        var nowDic = {};
        nowDic[this.day] = [];
        hall.GlobalFuncs.setInLocalStorage(ddz.gameModel.LAST_GETDAYREWARD_TIME,JSON.stringify(nowDic));
        var nowHour = hall.GlobalTimer.getCurHours();
        if(nowHour < 10){
            this.getDayRewardButton.interactable = false;
        }else {
            this.getDayRewardButton.interactable = true;
        }
    },
    setDayLoginState : function () {
        this.day = hall.GlobalTimer.getCurDay();
        var getCount = 0;
        var lastGetStateString = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.gameModel.LAST_GETDAYREWARD_TIME, "");
        if(lastGetStateString == "" || lastGetStateString.indexOf("{") < 0){
            this.setNowDayGetRewardRecord();
        }else {
            var lastGetStateDic = JSON.parse(lastGetStateString);
            if(!lastGetStateDic[this.day]){
                this.setNowDayGetRewardRecord();
            }else {
                var dayGetList = lastGetStateDic[this.day];
                getCount = dayGetList.length;
                var nowHour = hall.GlobalTimer.getCurHours();
                if(getCount != 0){
                    var lastGetHour = dayGetList[getCount-1];
                    if(lastGetHour < 18){
                        if(nowHour < 18){
                            this.getDayRewardButton.interactable = false;
                        }else {
                            this.getDayRewardButton.interactable = true;
                        }
                    }else {
                        this.getDayRewardButton.interactable = false;
                    }
                    if(getCount >= 2){
                        this.getDayRewardButton.interactable = false;
                    }
                }else {
                    this.setNowDayGetRewardRecord();
                }
            }
        }
        this.getDayRewardRichText.string = "<color=#1A6951><size=36>每日领奖("+getCount+"/2)<size><br/><size=30>奖励：" +
            "<img src='dda_button_diamond_black' height=34 width=42/> +1</color>";
    },

    //更新钻石数量
    changeDiamondCount : function () {
        //已有钻石数量
        this.diamondCount = hall.ME.udataInfo.diamondCount;
        this.haveCountRichText.string =
            "<img src='dda_button_diamond' height=34 width=42/><color=#ffffff> x"+this.diamondCount+"</color>";

        var richL = this.haveCountRichText.node.width;
        var moveX = (120-richL)/2;
        this.haveCountTipsLabel.x = moveX;
        this.haveCountRichText.x = moveX;

        if(this.lastCount != this.diamondCount && this.lastCount != 0 ){
            var acScale = cc.scaleTo(0.3,1.2);
            var acScale2 = cc.scaleTo(0.3,1);
            var sque = cc.sequence(acScale,acScale2);
            this.haveCountRichText.node.runAction(sque);
        }
        this.lastCount = this.diamondCount;
    },


    onClickCenterButton:function (event) {
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.button_click_sound, false);
        ddz.Share.shareWithType(ddz.Share.clickStatShareType.clickStatShareTypeGetDiamondHall);
    },

    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
    }


    // start () {
    //
    // },

    // update (dt) {},
});
