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
        // ty.NotificationCenter.listen(shot.EventType.UPDATE_INFINITEBULLET_NUMBER,this.updateInfiniteByllet, this);
        // ty.NotificationCenter.listen(shot.EventType.UPDATE_LASERAIMING_NUMBER,this.updateLaserAiming, this);
        ty.NotificationCenter.listen(shot.EventType.REPLAY_BG_MUSIC,this.rePlayBgMusic, this);
        // this.updateInfiniteByllet();
        // this.updateLaserAiming();

        hall.GlobalTimer.getCurWeek();
        ty.TuyooSDK.wechatGetFriendDataDebug();

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
    },

    rePlayBgMusic:function(){
        shot.AudioHelper.rePlayMusic();
    },

    updateUserInfo : function (result) {
        if(result.playinfo.max_score){
            shot.Share.shareKeywordReplace.bestScoreForSelf = result.playinfo.max_score;
        }
        this.bestScoreLabel.string = "最佳得分:"+shot.Share.shareKeywordReplace.bestScoreForSelf;
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
        ty.NotificationCenter.ignoreScope(this);
    }
    // start () {shot.GlobalFuncs.showRankList
    //
    // },

});
