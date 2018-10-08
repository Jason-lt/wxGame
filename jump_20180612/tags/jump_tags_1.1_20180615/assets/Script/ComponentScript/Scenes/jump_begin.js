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
        aniSprite :{
            default : null,
            type : cc.Node
        }
    },

    onGetGift : function () {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["getDiamond"]);
        jump.GlobalFuncs.showDiamondGift(0);
    },

    startGame : function () {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["startGame"]);
        var sceneName = 'jump_main';
        var onLaunched = function () {
            // var logicScene = cc.director.getScene();
            // var no = logicScene.children[0];
            // var window = no.getComponent("jump_rank");
            // window.showRankListForShare();
        };
        cc.director.loadScene(sceneName,onLaunched);
    },

    friendRank : function () {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["friendRank"]);
        jump.GlobalFuncs.showRankList("");
        // var sceneName = 'jump_rank';
        // var onLaunched = function () {
        // };
        // cc.director.loadScene(sceneName,onLaunched);
    },

    holkRank : function () {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["holkRank"]);
        jump.Share.shareWithType(jump.Share.onShareType.clickStatShareTypeRankList);
        // jump.Share.shareWithType(jump.Share.onShareType.clickStatShareTypeShowHighTotalThird);
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad :function() {
        this.aniSprite.runAction(cc.rotateTo(13000, 1000000));

        var result = ty.UserInfo.onShowParam;
        if(!result){
            return;
        }
        //取相关参数
        var scene = result.scene;
        var query = result.query;
        var shareTicket;
        if(query && query.sourceCode && result.isFirstOpen){//从小程序消息卡片中点入
            if(query.sourceCode == jump.Share.onShareType.clickStatShareTypeRankList && scene == 1044){//群排行榜
                shareTicket = result.shareTicket;
                if(shareTicket){
                    jump.GlobalFuncs.showRankList(shareTicket);
                }
            }
        }
        ty.UserInfo.onShowParam.isFirstOpen = false;
    },
    onDestroy:function(){
        this.aniSprite.removeFromParent();
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }
    // start () {
    //
    // },

    // update (dt) {},
});
