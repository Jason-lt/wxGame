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
        aniSpriteNode :{
            default : null,
            type : cc.Node
        },
        bestScoreLabel : {
            default : null,
            type : cc.Label
        },
        diamondNode : {
            default : null,
            type : cc.Node
        }
        // infiniteBylletiText:cc.RichText,
        // laserAimingText:cc.RichText,
    },

    onGetGift : function () {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["getDiamond"]);
        shot.GlobalFuncs.showDiamondGift(0);
    },

    startGame : function () {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["startGame"]);
        var sceneName = 'shot_main';
        var onLaunched = function () {
            // var logicScene = cc.director.getScene();
            // var no = logicScene.children[0];
            // var window = no.getComponent('shot_rank');
            // window.showRankListForShare();
        };
        cc.director.loadScene(sceneName,onLaunched);
    },

    friendRank : function () {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["friendRank"]);
        shot.GlobalFuncs.showRankList("");
        // var sceneName = 'shot_rank';
        // var onLaunched = function () {
        // };
        // cc.director.loadScene(sceneName,onLaunched);
    },

    // onBulletProp:function(){
    //     ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["beginWxzd"]);
    //     shot.gameModel.getUniqueBoxId("item:1371","wxzd");
    // },
    //
    // onLaserProp:function(){
    //     ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["beginGgmzq"]);
    //     shot.gameModel.getUniqueBoxId("item:1372","jgmzq");
    //     // shot.GlobalFuncs.showMysteryGifgBag();
    // },

    // LIFE-CYCLE CALLBACKS:

    onLoad :function() {
        ty.NotificationCenter.listen(shot.EventType.UPDATE_USERINFO,this.updateUserInfo, this);
        this.bestScoreLabel.string = "最佳得分:"+shot.Share.shareKeywordReplace.bestScoreForSelf;
        shot.gameModel.getUserInfoForShot();
        // ty.NotificationCenter.listen(shot.EventType.UPDATE_INFINITEBULLET_NUMBER,this.updateInfiniteByllet, this);
        // ty.NotificationCenter.listen(shot.EventType.UPDATE_LASERAIMING_NUMBER,this.updateLaserAiming, this);
        ty.NotificationCenter.listen(shot.EventType.REPLAY_BG_MUSIC,this.rePlayBgMusic, this);
        // this.updateInfiniteByllet();
        // this.updateLaserAiming();

        hall.adManager.checkVideoAd(); //Load广告
        // ty.TuyooSDK.wechatGetFriendDataDebug();
        // shot.GlobalFuncs.getFriendInfo();
        hall.GlobalTimer.getCurWeek();

        var result = ty.UserInfo.onShowParam;
        if(!result){
            return;
        }
        //取相关参数
        var scene = result.scene;
        var query = result.query;
        var shareTicket;
        if(query && query.sourceCode && result.isFirstOpen){//从小程序消息卡片中点入
            if(query.sourceCode == shot.Share.onShareType.clickStatShareTypeRankList && scene == 1044){//群排行榜
                shareTicket = result.shareTicket;
                if(shareTicket){
                    shot.GlobalFuncs.showRankList(shareTicket);
                }
            }
        }
        ty.UserInfo.onShowParam.isFirstOpen = false;

        shot.AudioHelper.playMusic(shot.EffectPath_mp3.musicStart,true);

        this.changeDiamondNodeActive();
        ty.NotificationCenter.listen(shot.EventType.GUNNER_SHARE_SCHEME,this.changeDiamondNodeActive,this);


        this.getAdMsg();
        ty.NotificationCenter.listen(ty.EventType.GET_AD_MSG_SUCCESS,this.getAdMsg,this);

    },

    getAdMsg : function () {
        if(!shot.gameModel.getAllCheckConfig()){
            var sceneSize = cc.director.getWinSize();
            hall.adManager.showAd({x:72,y:sceneSize.height/2+50});
        }
    },

    changeDiamondNodeActive : function () {
        this.diamondNode.active = !shot.gameModel.getAllCheckConfig();

        if(shot.GameWorld.gunnerShareSchemeConfig && shot.GameWorld.gunnerShareSchemeConfig.showGameClubButton){
            if(!shot.gameClubButton){
                var sysInfo = hall.adManager.getSysInfo();
                var screenHeight = sysInfo.screenHeight;
                hall.LOGD("===","===screenHeight==="+screenHeight);
                shot.gameClubButton = wx.createGameClubButton({
                    type : "image",
                    image : "https://nslyqn.nalrer.cn/nsly/crazygun/icon/game.png",
                    icon: 'green',
                    style: {
                        left: 10,
                        top: screenHeight-68,
                        width: 42,
                        height: 42
                    }
                });
            }
            shot.gameClubButton.show();
        }
    },

    rePlayBgMusic:function(){
        shot.AudioHelper.rePlayMusic();
    },

    updateUserInfo : function (result) {
        // {
        //     "cmd": "game",
        //     "result": {
        //     "action": "get_user_info",
        //         "gameId": 106,
        //         "userId": 10259,
        //         "clientId": "H5_5.1_weixin.weixin.0-hall106.weixin.rich",
        //         "playinfo": {
        //         "history_score": 125666,
        //             "max_score": 122
        //     }
        // }
        // }
        if(result.playinfo.max_score){
            shot.Share.shareKeywordReplace.bestScoreForSelf = result.playinfo.max_score;
            shot.GlobalFuncs.upDateRankData(result.playinfo.max_score);
        }
        // this.bestScoreLabel.string = "最佳得分:"+shot.Share.shareKeywordReplace.bestScoreForSelf;

        if(result.playinfo.history_score){
            this.bestScoreLabel.string = "历史最佳:"+result.playinfo.history_score;
        }
    },

    // // 刷新无限子弹道具
    // updateInfiniteByllet:function(){
    //     this.infiniteBylletiText.node.active = true;
    //     this.infiniteBylletiText.string = "<color=#FCE5BC>无限子弹"+"x"+hall.ME.udataInfo.infiniteBulletCount+"</c>";
    // },
    //
    // // 刷新激光瞄准道具
    // updateLaserAiming:function(){
    //     this.laserAimingText.node.active = true;
    //     this.laserAimingText.string = "<color=#FCE5BC>激光瞄准器"+"x"+hall.ME.udataInfo.laserAimingCount+"</c>";
    // },

    update : function (dt) {
        this.aniSpriteNode.rotation += 1;
    },
    onDestroy:function(){
        if(shot.gameClubButton){
            shot.gameClubButton.destroy();
        }
        hall.adManager.hideAd();
        shot.gameClubButton = null;
        ty.NotificationCenter.ignoreScope(this);
    }
    // start () {shot.GlobalFuncs.showRankList
    //
    // },

});
