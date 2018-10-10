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

        infoNode : {
            default : null,
            type : cc.Node
        },
        levelLabel : {
            default : null,
            type : cc.Label
        },
        solveLabel : {
            default : null,
            type : cc.Label
        },
        coinLabel : {
            default : null,
            type : cc.Label
        },
        scoreLabel : {
            default : null,
            type : cc.Label
        },
        startGameButton : {
            default : null,
            type : cc.Button
        },
        debugTime : 0
    },

    // LIFE-CYCLE CALLBACKS:

    blackAction : function () {

    },
    backAction : function () {
    },
    onLoad : function() {
        hall.GlobalFuncs.btnScaleEffect(this.startGameButton.node,1.13);
        ty.NotificationCenter.listen(double.EventType.TITLE_PAGE_REVIEW,this.updateTitlePage,this);
        ty.NotificationCenter.listen(double.EventType.GAME_START,this.gameStartForTitlePage,this);
    },
    gameStartForTitlePage : function () {
        this.node.removeFromParent();
    },
    updateTitlePage : function () {
        this.infoNode.active = !hall.GlobalFuncs.ReadBoolFromLocalStorage(double.gameModel.IS_NEW_USER,true);

        // double.AudioHelper.playMusic(double.EffectPath_mp3.music_bg_main,true);
        double.GameWorld.totalLevel = hall.GlobalFuncs.ReadNumFromLocalStorage(double.gameModel.GAME_LEVEL ,1);
        this.levelLabel.string = "第"+ double.GameWorld.totalLevel+"关";
        var nextNewLevel = 0;
        var addTemp = 2;
        while (nextNewLevel < double.GameWorld.totalLevel){
            nextNewLevel += addTemp;
            addTemp ++;
        }
        this.solveLabel.string = "第"+(nextNewLevel+1)+"关解锁新物品";
        if( hall.GlobalFuncs.ReadNumFromLocalStorage(double.gameModel.GAME_BEST_SCORE ,0) == 0){
            this.scoreLabel.node.active = false;
        }else {
            this.scoreLabel.node.active = true;
            this.scoreLabel.string = "最高成绩:"+hall.GlobalFuncs.ReadNumFromLocalStorage(double.gameModel.GAME_BEST_SCORE ,0);
        }

        this.coinLabel.string = double.GameWorld.chipNumber;

        if(double.GameWorld.weaponNow.indexOf("gun") > -1){
            double.GlobalFuncs.setDoubleGunType(0,double.GameWorld.weaponNow);
        }else {
            double.GlobalFuncs.setDoubleGunType(1,double.GameWorld.weaponNow);
        }
        this.debugTime = 0;
    },

    rankAction : function () {
        // double.AudioHelper.playEffect(double.EffectPath_mp3.doubleBtnEffect,false);
        // this.closeSelfWindow();
        double.GlobalFuncs.showRankList();
    },
    weaponsDepotAction : function () {
        // double.AudioHelper.playEffect(double.EffectPath_mp3.doubleBtnEffect,false);
        // this.closeSelfWindow();
        double.GlobalFuncs.showWeaponsDepot();
    },
    gameStartAction : function () {
        // double.AudioHelper.playEffect(double.EffectPath_mp3.doubleBtnEffect,false);
        this.closeSelfWindow();
        ty.NotificationCenter.trigger(double.EventType.GAME_START,false);
    },
    closeSelfWindow : function () {
        // double.AudioHelper.playMusic(double.EffectPath_mp3.music_bg_game,true);
        this.node.removeFromParent();
    },

    showDebugPanel : function () {
        if(!debugMode){
            return;
        }
        this.debugTime ++;
        if(this.debugTime >= 10){
            double.GlobalFuncs.showDebugPanel();
        }
    },

    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }

    // update (dt) {},
});
