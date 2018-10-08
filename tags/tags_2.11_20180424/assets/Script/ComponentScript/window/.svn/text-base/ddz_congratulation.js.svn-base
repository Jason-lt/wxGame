

cc.Class({
    extends: cc.Component,

    properties: {
        progress : {
            default : null,
            type : cc.Node
        },
        buttons:{
            default : null,
            type : cc.Node
        },
        bottom : {
            default : null,
            type : cc.Node
        },
        rewardRichText : {
            default : null,
            type : cc.RichText
        },

        backButton : {
            default : null,
            type : cc.Button
        },

        aniNode: cc.Node,
        // diamondCount : "",//用户钻石数量
        fightState : 1,//闯关状态(1、开始,2、某关中断,3、某关失败)
        nowFight :3,//当前闯关局数
        lotteryTimeS:"",//平分奖金开奖描述
        shouldUpdate : false,
        richString : "",
        winnerCountNumber :"1"
    },
    onLoad : function() {
        ddz.matchModel.matchUpdate();
        ddz.matchModel.getMatchDes();
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_MATCH_INFO, this.onUpDateMatchInfo, this);

        var window = this.progress.getComponent('ddz_progress');
        window.setProgress(6, true);

        var window2 = this.buttons.getComponent('ddz_buttonList');
        window2.parentScene = this;

        var window3 = this.bottom.getComponent('ddz_buttomButtons');
        window3.parentScene = this;

        this.setOriginalData();

        ddz.AudioHelper.playMusic('/resources/sound/Victory.mp3', false);


        var winSize = cc.director.getWinSize();

        var bg = this.node.getChildByName('ddz_scene_bg_0');

        //全屏适配
        this.node.width = winSize.width;
        this.node.height = winSize.height;

        bg.width = winSize.width;
        bg.height = winSize.height;

        var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        if (backButtonH){
            this.backButton.node.y = backButtonH;
        }
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
        ty.NotificationCenter.listen(ty.EventType.GET_DIAMOND, this.getDiamond, this);
        ty.NotificationCenter.listen(ty.EventType.UPDATE_BUTTON_TEXT, this.updateButtonText, this);

        ddz.gameModel.checkShareReward(ddz.Share.SharePointType.tongGuan);

        //先播放开始的,再播放循环的
        var ani = this.aniNode.getComponent(cc.Animation);
        ani.once('finished',  this.startAniFinish,    this);
        ani.play('ddz_congratulation');
    },
    startAniFinish:function (aniState) {
        var ani = this.aniNode.getComponent(cc.Animation);
        ani.play('ddz_congratulation_xunhuan');
    },

    onUpDateMatchInfo:function () {
        var info = ddz.matchModel.getCurUpdateInfo();
        var num = info.lotteryInfo.winnerCount;
        if(num){
            this.winnerCountNumber = num;
        }else {
            this.winnerCountNumber = "1";
        }
        var lotteryTime = info.lotteryInfo.lotteryTime;
        // this.lotteryTimeS = "<color=#ffffff>奖金将于 "+lotteryTime+" 发放</color>";
        this.lotteryTimeS = "<color=#ffffff>每天中午12：00发放奖励</color>";
    },
    
    setMcountDetail:function (mcountList) {
        var richString = "通关奖励: " ;
        var haveS = false;
        if(mcountList && mcountList.length > 0){
            for (var i = 0 ; i < mcountList.length ; i ++){
                var reward = mcountList[i];
                if(reward.icon == "item:1311"){
                    richString = richString + "<img src='dda_button_diamond'/>" +"<color=#ffffff> +"+reward.count+"</c>";
                    haveS = true;
                }
                // if(reward.icon == "user:chip"){//金币不处理
                //     richString = richString + "<img src='dda_button_diamond' height=38 width=44/>" +"<color=#ffffff> x"+reward.count+"</c>" ;
                // }
                if(reward.icon == "user:coupon"){
                    var lossM = hall.GlobalFuncs.getMoneyStringWithCoupons(reward.count);
                    richString = richString + "<color=#ffffff>、￥</color>" +"<color=#ffffff>"+lossM+"</c>";
                    haveS = true;
                }
            }
        }

        if (haveS){
            richString = richString + "<br/>";
        }else {
            richString = "";
        }

        if(this.lotteryTimeS.length > 2){
            richString = richString + this.lotteryTimeS;
            this.rewardRichText.string  = richString;
        }else {
            this.richString = richString;
            this.shouldUpdate = true;
        }

        // "mcount":[
        //     {
        //         "count":1,
        //         "name":"钻石",
        //         "iconPath":"http://ddz.dl.tuyoo.com/cdn37/hall/item/imgs/item_1311.png",
        //         "icon":"item:1311"
        //     },
        //     {
        //         "count":600000,
        //         "name":"金币",
        //         "iconPath":"http://ddz.dl.tuyoo.com/cdn37/hall/pdt/imgs/goods_t300k_2.png",
        //         "icon":"user:chip"
        //     },
        //     {
        //         "count":5000,
        //         "name":"红包券",
        //         "iconPath":"http://ddz.dl.tuyoo.com/cdn37/hall/item/imgs/coupon_1.png",
        //         "icon":"user:coupon"
        //     }
        // ],
    },

    setOriginalData : function () {
        var waitInfo = ddz.matchModel.getCurWaitInfo();
        // this.fightState = 2;
        // this.nowFight = "1";

        if(!waitInfo){
            this.fightState = 1;
            this.nowFight = "0";
        }else {
            if (waitInfo.isLevelUp) {
                this.fightState = 2;
            } else {
                this.fightState = 3;
            }
            this.nowFight = waitInfo.stageIndex;
        }
    },
    removeAni : function () {
        ty.NotificationCenter.trigger(ddz.EventType.REMOVE_TABLE_ANI);
        ty.NotificationCenter.trigger(ddz.EventType.RESET_TABLE);
        this.node.removeFromParent();
    },

    onBackButton: function(){
        this.shut();
        this.removeAni();
        hall.GlobalFuncs.gotoDdz();
    },
    onRankButton: function () {
        this.removeAni();
        var sceneName = 'ddz_rank';
        var onLaunched = function () {
            var logicScene = cc.director.getScene();
            var no = logicScene.children[0];
            var window = no.getComponent("ddz_rank");
            window.showRankListForShare();
        };
        cc.director.loadScene(sceneName,onLaunched);
    },
    onGetRewardButton: function () {
        this.removeAni();
        var sceneName = 'ddz_reward';
        cc.director.loadScene(sceneName);
    },
    onDiamondButton: function () {
        this.removeAni();
        var sceneName = 'ddz_diamond';
        var fightState = this.fightState;
        var nowFight = this.nowFight;
        var onLaunched = function () {
            var logicScene = cc.director.getScene();
            var no = logicScene.children[0];
            var window = no.getComponent("ddz_diamond");
            // diamondCount,type,state,guan
            // type(1、开始闯关(活动详情),2、钻石主页,3、闯关失败,4、继续挑战)
            window.setDetailWithDiamondCount(2,fightState,nowFight);
        };
        cc.director.loadScene(sceneName,onLaunched);
    },

    onTopButtonAction : function () {
        // hall.LOGE(null, "file = [ddz_congratulation] fun = [onTopButtonAction]分享");
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.button_click_sound, false);
        ddz.Share.shareKeywordReplace.allWinnerCount = this.winnerCountNumber;
        var shareType = ddz.Share.clickStatShareType.clickStatShareTypeCongratulation;
        ddz.Share.shareWithType(shareType);
    },

    addTipsWindow : function (tips,timer) {
        var preFabPath = "prefabs/ddz_window_tips";
        var  comName = "ddz_tipsWindow";
        var that = this;
        ddz.matchModel.showPopWinByPreFab(preFabPath, function (preFabNode) {
            var window = preFabNode.getComponent(comName);
            window.parentScene = that;
            var testArray = [
                {
                    title :"分享到群",
                    bottomType : 0
                }
            ];
            window.setTitleContentAndButtons("提示",tips, testArray);
        });
    },

    getDiamond:function(){
        hall.LOGE("=="," file = [ddz_congratulation] fun = [getDiamond] ");
        ddz.GlobalFuncs.playZuanShi();
    },

    updateButtonText:function(diamond,pointId){
        hall.LOGE("=="," file = [ddz_congratulation] fun = [updateButtonText] diamond = " + diamond);
        var titileS = "";
        if (!diamond || diamond <= 0) {
            titileS = "<color=#FFFFFF>分享到群</c>";
        }else {
            titileS = "<color=#FFFFFF>分享到群</c><img src='dda_button_diamond'/><color=#FFFFFF>+1</c>";
        }
        var comBtnList = this.buttons.getComponent('ddz_buttonList');
        comBtnList.setTopTextWithButton(titileS);
    },

    playAnimationAfterShareWithType : function (shareType) {
        if (shareType && shareType != ddz.Share.clickStatShareType.clickStatShareTypeCongratulation) {
            return;
        }
        ddz.gameModel.checkShareReward(ddz.Share.SharePointType.tongGuan);
        var type = ddz.Share.resultType;
        hall.LOGD("=="," file = [ddz_congratulation] fun = [playAnimationAfterShareWithType] type = " + type);
        switch (type){
            case 1:
                //TODO:分享到微信群才能领取奖励哦
                var tips = "只有分享到微信群才能领取奖励哦";
                // var timer = 3;
                this.addTipsWindow(tips);
                break;
            case 2:
                var tips = "这个群已经分享过啦，分享到其他群吧";
                // var timer = 3;
                this.addTipsWindow(tips);
                //TODO: 这个群已经分享过啦，分享到其他群吧
                break;
            case 3:
                // ddz.GlobalFuncs.playZuanShi();
                //TODO: 钻石动画
                break;
            default:
                break;
        }
        ddz.Share.resultType = 0;
    },

    onClickCenterButton:function(){
        var shareType = ddz.Share.clickStatShareType.clickStatShareTypeCongratulation;
        ddz.Share.shareWithType(shareType);
    },

    onTempButtonAction : function () {
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.button_click_sound, false);
        ddz.matchModel.matchSignin();
        this.shut();
    },

    shut:function () {
        this.aniNode.removeFromParent();
        this.progress.removeFromParent();
        ddz.matchResultPanel = null;
        this.node.destroy();
        ty.NotificationCenter.ignoreScope(this);
    },

    update : function(dt) {
        if(this.shouldUpdate){
            if(this.lotteryTimeS.length > 2){
                this.richString = this.richString + this.lotteryTimeS;
                this.rewardRichText.string  = this.richString;
                this.shouldUpdate = false;
            }
        }
    },

    onDestroy : function () {
        // this.shareButton.node.off("click",this.onShareButton,this);
        ty.NotificationCenter.ignoreScope(this);
    },

    _onPreDestroy:function () {
        this._super();
        //删除动画
        this.aniNode.removeFromParent();
        this.progress.removeFromParent();
    }
});
