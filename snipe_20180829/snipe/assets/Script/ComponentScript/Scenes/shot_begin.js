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

        titleNode : {
            default : null,
            type : cc.Node
        },
        rankNode : {
            default : null,
            type : cc.Node
        },
        freeNode : {
            default : null,
            type : cc.Node
        },
        // aniSpriteNode :{
        //     default : null,
        //     type : cc.Node
        // },
        bestScoreLabel : {
            default : null,
            type : cc.Label
        },
        diamondNode : {
            default : null,
            type : cc.Node
        },
        freeToolNode : {
            default : null,
            type : cc.Node
        }
    },

    onGetGift : function () {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["getDiamond"]);
        snipe.GlobalFuncs.showDiamondGift(0);
    },

    onFreeTool : function () {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["freeTool"]);
        snipe.GlobalFuncs.showFreeTool();
    },

    startGame : function () {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["startGame"]);
        var sceneName = 'snipe_main';
        if(snipe.gameModel.getAllCheckConfig()){
            sceneName = 'snipe_throw';
        }
        var onLaunched = function () {
            // var logicScene = cc.director.getScene();
            // var no = logicScene.children[0];
            // var window = no.getComponent('snipe_rank');
            // window.showRankListForShare();
        };
        cc.director.loadScene(sceneName,onLaunched);
    },

    friendRank : function () {
        // hall.LOGE("+++","====friendRank=====");
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["friendRank"]);
        snipe.GlobalFuncs.showRankList("");
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad :function() {

        ty.NotificationCenter.listen(snipe.EventType.UPDATE_USERINFO,this.updateUserInfo, this);
        this.bestScoreLabel.string = "最佳得分:"+snipe.Share.shareKeywordReplace.bestScoreForSelf;
        snipe.gameModel.getUserInfoForShot();

        snipe.AudioHelper.playMusic(snipe.EffectPath_mp3.musicStart,true);
        ty.NotificationCenter.listen(snipe.EventType.REPLAY_BG_MUSIC,this.rePlayBgMusic, this);

        hall.adManager.checkVideoAd(); //Load广告
        hall.GlobalTimer.getCurWeek();

        this.changeDiamondNodeActive();
        this.changeGameClubButtonActive();
        ty.NotificationCenter.listen(snipe.EventType.GUNNER_SHARE_SCHEME,this.changeDiamondNodeActive,this);
        ty.NotificationCenter.listen(snipe.EventType.BSGS_CHECK_RESULT,this.changeDiamondNodeActive,this);
        ty.NotificationCenter.listen(snipe.EventType.GUNNER_SHARE_SCHEME,this.changeGameClubButtonActive,this);

        snipe.GlobalFuncs.setDayOriginGameData();
        this.getAdMsg();
        ty.NotificationCenter.listen(ty.EventType.GET_AD_MSG_SUCCESS,this.getAdMsg,this);

        snipe.gameModel.checkRewardWithSharePoint(snipe.Share.SharePointType.getFreeTool);
        ty.NotificationCenter.listen(snipe.EventType.GET_CHECK_REWARD,this.changeFreeToolNodeActive,this);

        var result = ty.UserInfo.onShowParam;
        if(!result){
            return;
        }
        //取相关参数
        var scene = result.scene;
        var query = result.query;
        var shareTicket;
        if(query && query.sourceCode && result.isFirstOpen){//从小程序消息卡片中点入
            if(query.sourceCode == snipe.Share.onShareType.clickStatShareTypeRankList && scene == 1044){//群排行榜
                shareTicket = result.shareTicket;
                if(shareTicket){
                    snipe.GlobalFuncs.showRankList(shareTicket);
                }
            }
        }

        ty.UserInfo.onShowParam.isFirstOpen = false;
    },

    // getAdMsg : function () {
    //     if(!snipe.gameModel.getAllCheckConfig()){
    //         if(hall.adManager.getAdNodeList().length < 1){
    //             var sceneSize = cc.director.getWinSize();
    //             hall.adManager.showAd({x:72,y:sceneSize.height/2+50});
    //         }else {
    //             hall.adManager.getAdNodeList()[0].showAdNode();
    //         }
    //     }
    // },

    getAdMsg : function () {
        if(hall.GlobalFuncs.ReadNumFromLocalStorage(snipe.gameModel.OPEN_ADBTN_STATE_TODAY,0) >= 3){
            snipe.GlobalFuncs.hideAdBtnWithTag(5001,true);
            return;
        }
        if(hall.GlobalFuncs.ReadNumFromLocalStorage(snipe.gameModel.OPEN_ADBTN_COUNT_TODAY,0) < snipe.GameWorld.growthConfig.showDelayed){
            snipe.GlobalFuncs.hideAdBtnWithTag(5001,true);
            return;
        }

        if(!snipe.gameModel.getAllCheckConfig()){
            var sceneSize = cc.director.getWinSize();
            if(snipe.GameWorld.growthConfig['home'].indexOf('CO') > -1){
                if(hall.GlobalFuncs.ReadNumFromLocalStorage(snipe.gameModel.OPEN_ADBTN_STATE_TODAY,0) != 1){
                    if(hall.adManager.getAdNodeByTag(5001)){
                        hall.adManager.getAdNodeByTag(5001).showAdNode();
                    }else {
                        hall.adManager.showAd({x:72,y:sceneSize.height/2+75},5001);
                    }
                }
            }
            if(snipe.GameWorld.growthConfig['home'].indexOf('STU') > -1){
                if(hall.GlobalFuncs.ReadNumFromLocalStorage(snipe.gameModel.OPEN_ADBTN_STATE_TODAY,0) != 2){
                    snipe.sxAdmanager.show(72,sceneSize.height/2-75,snipe.GameWorld.growthConfig.STUScale);
                }
            }
        }
    },

    changeDiamondNodeActive : function () {
        if(snipe.gameModel.getAllCheckConfig()){
            this.diamondNode.active = false;
            // this.titleNode.y = -135;
            // this.rankNode.x = -126;
            // this.rankNode.y = -437;
            // this.freeNode.x = 126;
            // this.freeNode.y = -437;
        }else {
            if(ty.UserInfo.isInBSGS){
                this.diamondNode.active = snipe.GameWorld.toolUserTimeConfig.diamondShow.bsgs;
            }else {
                this.diamondNode.active = snipe.GameWorld.toolUserTimeConfig.diamondShow.nBsgs;
            }
            // this.titleNode.y = 0;
            // this.rankNode.x = 228;
            // this.rankNode.y = 137;
            // this.freeNode.x = 228;
            // this.freeNode.y = 0;
        }
    },
    changeFreeToolNodeActive : function (result) {
        //{"cmd":"hall_share2","result":{"action":"check_reward","gameId":6,"userId":10042,"pointId":67890009,"leftCount":0}}
        this.freeToolNode.active = result.leftCount;
    },
    changeGameClubButtonActive : function () {

        if(snipe.GameWorld.gunnerShareSchemeConfig && snipe.GameWorld.gunnerShareSchemeConfig.showGameClubButton){
            if(!snipe.gameClubButton){
                var sysInfo = hall.adManager.getSysInfo();
                var screenHeight = sysInfo.screenHeight;
                hall.LOGD("===","===screenHeight==="+screenHeight);
                snipe.gameClubButton = wx.createGameClubButton({
                    type : "image",
                    image : "https://nslyqn.nalrer.cn/nsly/supersnipe/icon/game.png",
                    // https://nslyqn.nalrer.cn/nsly/supersnipe/icon/game.png
                    icon: 'green',
                    style: {
                        left: 10,
                        top: screenHeight-68,
                        width: 42,
                        height: 42
                    }
                });
            }
            snipe.gameClubButton.show();
        }
    },

    rePlayBgMusic:function(){
        snipe.AudioHelper.playMusic(snipe.EffectPath_mp3.musicStart,true);
        // snipe.AudioHelper.rePlayMusic();
    },

    updateUserInfo : function (result) {

        if(result.playinfo.max_score){
            snipe.Share.shareKeywordReplace.bestScoreForSelf = result.playinfo.max_score;
            snipe.GlobalFuncs.upDateRankData(result.playinfo.max_score);
        }
        // this.bestScoreLabel.string = "最佳得分:"+snipe.Share.shareKeywordReplace.bestScoreForSelf;

        if(result.playinfo.history_score){
            this.bestScoreLabel.string = "历史最佳:"+result.playinfo.history_score;
        }
    },

    update : function (dt) {
        // this.aniSpriteNode.rotation += 1;
    },
    onDestroy:function(){
        if(snipe.gameClubButton){
            snipe.gameClubButton.destroy();
        }

        snipe.GlobalFuncs.hideAdBtnWithTag(5001,true);

        snipe.gameClubButton = null;
        ty.NotificationCenter.ignoreScope(this);
    }
    // start () {snipe.GlobalFuncs.showRankList
    //
    // },

});
