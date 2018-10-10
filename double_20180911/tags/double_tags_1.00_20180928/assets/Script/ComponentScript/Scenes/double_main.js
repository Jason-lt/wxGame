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

    // ctor : function () {
    //     this.arrowPool = null;
    // },

    extends: cc.Component,

    properties: {

        windowWidth : 0,
        windowHeight : 0,

        //标的物
        objectNode : {
            default : null,
            type : cc.Node
        },
        objectWin : {
            default: null,
            serializable: false
        },

        //枪
        leftGunNode : {
            default : null,
            type : cc.Node
        },
        leftGunWin: {
            default: null,
            serializable: false
        },
        rightGunNode : {
            default : null,
            type : cc.Node
        },
        rightGunWin: {
            default: null,
            serializable: false
        },
        leftGunButton : {
            default : null,
            type : cc.Button
        },
        rightGunButton : {
            default : null,
            type : cc.Button
        },
        leftGunNewerNode : {
            default : null,
            type : cc.Node
        },
        rightGunNewerNode : {
            default : null,
            type : cc.Node
        },

        //游戏失败
        gameFailNode : {
            default : null,
            type : cc.Node
        },
        gameFailCount : 0,
        gameFailNodeGap : 60,

        //游戏进度/进度条
        progressNodeSprite : {
            default : null,
            type : cc.Sprite
        },
        objectBloodAll : 0,
        levelProgressNode : {
            default : null,
            type : cc.Node
        },
        levelProgressSpriteList : [cc.Sprite],
        levelProgressSpriteFrameList : [cc.SpriteFrame],
        // shouldLevelUp : false,

        //关卡信息
        doubleInfoNode : {
            default : null,
            type : cc.Node
        },
        levelLabel : {
            default : null,
            type : cc.Label
        },
        scoreLabel : {
            default : null,
            type : cc.Label
        },
        levelAniNode : {
            default : null,
            type : cc.Node
        },
        levelChangeLabel : {
            default : null,
            type : cc.Label
        },

        //新手
        tipsLabel : {
            default : null,
            type : cc.RichText
        },
        caidaiPrefab : {
            default : null,
            type : cc.Prefab
        },

        //即将超越
        surpassNode : {
            default : null,
            type : cc.Node
        },
        surpassSprite : {
            default : null,
            type : cc.Sprite
        },
        surpassTexture : cc.Texture2D,
        surpassSpriteFrame : cc.SpriteFrame,
        surpassCount : 0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad : function() {
        this.rightGunWin = this.rightGunNode.getComponent('double_gun');
        this.rightGunWin.parentScene = this;
        this.leftGunWin = this.leftGunNode.getComponent('double_gun');
        this.leftGunWin.parentScene = this;
        this.objectWin = this.objectNode.getComponent('double_object');
        this.objectWin.parentScene = this;

        var winSize = cc.director.getWinSize();
        this.windowWidth = winSize.width;
        this.windowHeight = winSize.height;

        // this.leftGunButton.node.on(cc.Node.EventType.TOUCH_START, this.openFireLeftButtonTouchStart, this, true);
        this.leftGunButton.node.on(cc.Node.EventType.TOUCH_END, this.openFireLeftButtonTouchEnded, this, true);
        // this.rightGunButton.node.on(cc.Node.EventType.TOUCH_START, this.openFireRightButtonTouchStart, this, true);
        this.rightGunButton.node.on(cc.Node.EventType.TOUCH_END, this.openFireRightButtonTouchEnded, this, true);

        double.GlobalFuncs.setDayOriginGameData();
        this.setSurpassNodeInit();

        //数据初始化
        double.GameWorld.totalLevel = hall.GlobalFuncs.ReadNumFromLocalStorage(double.gameModel.GAME_LEVEL ,1);
        // double.GameWorld.totalLevel = 5;
        double.GameWorld.newestObjectIndex = hall.GlobalFuncs.ReadNumFromLocalStorage(double.gameModel.GAME_NEWEST_OBJECT_INDEX ,2);
        if(debugMode){
            double.GameWorld.chipNumber = hall.GlobalFuncs.ReadNumFromLocalStorage(double.gameModel.GAME_COIN_NUMBER ,50000);
        }else {
            double.GameWorld.chipNumber = hall.GlobalFuncs.ReadNumFromLocalStorage(double.gameModel.GAME_COIN_NUMBER ,0);
        }
        var weaponStateString = hall.GlobalFuncs.ReadStringFromLocalStorage(double.gameModel.GAME_WEAPON_LOCK_STATE,"");
        if(weaponStateString == ""){
            double.GameWorld.weaponUnlockState = {};
            var i;
            for (i = 0 ; i < double.GameWorld.doubleGunNameList.length ; i ++){
                double.GameWorld.weaponUnlockState[double.GameWorld.doubleGunNameList[i]] = false;
            }
            for (i = 0 ; i < double.GameWorld.doubleBowNameList.length ; i ++){
                double.GameWorld.weaponUnlockState[double.GameWorld.doubleBowNameList[i]] = false;
            }
            double.GameWorld.weaponUnlockState["gun0"] = true;
            hall.GlobalFuncs.setInLocalStorage(double.gameModel.GAME_WEAPON_NOW,"gun0");
            double.GameWorld.weaponNow = "gun0";
        }else {
            double.GameWorld.weaponUnlockState = JSON.parse(weaponStateString);
            double.GameWorld.weaponNow = hall.GlobalFuncs.ReadStringFromLocalStorage(double.gameModel.GAME_WEAPON_NOW,"");
        }
        double.GameWorld.totalScore = 0;

        this.newerGameStart();

        ty.NotificationCenter.listen(double.EventType.GAME_START,this.gameStart,this);
        ty.NotificationCenter.listen(double.EventType.GAME_START_LEVEL_UP,this.gameStartToLevelUp,this);
        ty.NotificationCenter.listen(double.EventType.GAME_OVER,this.gameOverNoChange,this);
        ty.NotificationCenter.listen(double.EventType.GAME_OBJECT_UP,this.levelNumberUp,this);
        ty.NotificationCenter.listen(double.EventType.GAME_CONTINUE,this.gameContinue,this);

        hall.GlobalTimer.getCurWeek();

        // double.AudioHelper.playMusic(double.EffectPath_mp3.music_bg_game,true);
        // that.nowScoreLabel.string = shot.GameWorld.totalScore;
        // that.addScoreAniPool.put(aniNode);
        // aniNode.removeFromParent();
    },

    newerGameStart : function () {
        this.doubleInfoNode.active = false;
        this.objectNode.active = false;
        double.GlobalFuncs.showTitlePage();
        // // //TODO:
        // double.GlobalFuncs.showWindowNewWeapon(double.windowNewWeaponType.goldTreasureChest,5);
        // double.GlobalFuncs.showWindowNewWeapon(double.windowNewWeaponType.newWeapon,5);
        // double.GlobalFuncs.showRewardWeapon();
    },

    gameStart : function (resurgence) {
        this.setSurpassNodeInit();
        if(resurgence){
            this.gameResurgence();
            return;
        }
        double.GameWorld.totalScore = 0;
        if(hall.GlobalFuncs.ReadBoolFromLocalStorage(double.gameModel.IS_NEW_USER,true) || double.GameWorld.testObject){
            this.leftGunNewerNode.active = true;
            this.rightGunNewerNode.active = true;
            this.tipsLabel.node.active = true;
            this.surpassNode.active = false;
        }else {
            this.leftGunNewerNode.active = false;
            this.rightGunNewerNode.active = false;
            this.tipsLabel.node.active = false;
            this.surpassNode.active = true;
        }
        this.gameNextLevelWithAni();
    },
    gameNextLevelWithAni : function () {
        this.doubleInfoNode.active = true;
        this.levelAniNode.active = true;
        this.levelChangeLabel.node.x = 500;
        if(hall.GlobalFuncs.ReadBoolFromLocalStorage(double.gameModel.IS_NEW_USER,true) || double.GameWorld.testObject){
            this.levelChangeLabel.string = "";
            this.gameNextLevel();
            this.levelAniNode.active = false;
            return;
        }else {
            this.levelChangeLabel.string = "第"+ double.GameWorld.totalLevel+"关";
        }
        var animation = this.levelAniNode.getComponent(cc.Animation).getAnimationState("levelChange");
        var that = this;
        animation.once("finished", function (target) {
            that.gameNextLevel();
            that.levelAniNode.active = false;
        });
        animation.play();
    },
    gameStartToLevelUp : function () {
        this.setSurpassNodeInit();
        this.gameNextLevelWithAni();
    },
    gameResurgence : function () {
        this.doubleInfoNode.active = true;
        this.objectWin.changeObjectType();
        double.GameWorld.gameOver = false;
        double.GameWorld.gamePause = false;
    },
    gameContinue : function () {
        if(double.GameWorld.gameOver){
            this.gameOverShowWindow();
            return;
        }
        if(double.GameWorld.gameLevelUp){
            this.levelNumberUp();
        }
    },

    gameNextLevel : function () {
        double.GlobalFuncs.getFriendInfo();
        if(double.GameWorld.weaponNow.indexOf("gun") > -1){
            double.GlobalFuncs.setDoubleGunType(0,double.GameWorld.weaponNow);
        }else {
            double.GlobalFuncs.setDoubleGunType(1,double.GameWorld.weaponNow);
        }

        this.objectNode.active = true;

        if(hall.GlobalFuncs.ReadBoolFromLocalStorage(double.gameModel.IS_NEW_USER,true) || double.GameWorld.testObject){
            this.levelLabel.string = "";
            this.scoreLabel.string = double.GameWorld.totalScore+"";
            double.GameWorld.levelObjectNumber = 3;
            if(double.GameWorld.testObject){
                double.GameWorld.levelObjectList = [double.GameWorld.testObject,double.GameWorld.testObject,double.GameWorld.testObject];
            }else {
                double.GameWorld.levelObjectList = ["object0","object0","object0"];
            }
            this.levelProgressNode.x = 35;
            for (var i = 0 ; i < this.levelProgressSpriteList.length ; i ++){
                this.levelProgressSpriteList[i].node.active = true;
                this.levelProgressSpriteList[i].spriteFrame = this.levelProgressSpriteFrameList[0];
                if(i == 4 || i == 3){
                    this.levelProgressSpriteList[i].node.active = false;
                }
            }
            this.getNextObjectTypeNewer();
        }else {
            this.levelLabel.string = "第"+ double.GameWorld.totalLevel+"关";
            this.scoreLabel.string = double.GameWorld.totalScore+"";
            double.GameWorld.levelObjectNumber = 0;
            this.chooseLevelObject();
            this.getNextObjectType();
        }
        double.GameWorld.gameOver = false;
        double.GameWorld.gamePause = false;
    },

    chooseLevelObject : function () {
        double.GameWorld.levelObjectList = [];
        var i;
        //配置物品
        //刚解锁的新物品必定出现在下一关第一个
        var nextNewLevel = 0;
        var addTemp = 2;
        while (nextNewLevel < double.GameWorld.totalLevel){
            nextNewLevel += addTemp;
            if(nextNewLevel == double.GameWorld.totalLevel-1){
                double.GameWorld.levelObjectList.push("object"+double.GameWorld.newestObjectIndex);
            }
            addTemp ++;
        }

        if(double.GameWorld.newestObjectIndex <= 3){
            for (i = 0 ; i <= double.GameWorld.newestObjectIndex ; i ++){
                if(double.GameWorld.totalLevel != 3 || i != double.GameWorld.newestObjectIndex){
                    double.GameWorld.levelObjectList.push("object"+i);
                }
            }
            if(double.GameWorld.totalLevel == 5){
                var tempN = hall.GlobalFuncs.getRandomNumberBefore(3)+1;
                double.GameWorld.levelObjectList.push(double.GameWorld.levelObjectList[tempN]);
                double.GameWorld.levelObjectList[tempN] = "box";
            }
            if(double.GameWorld.newestObjectIndex == 3){

            }else if(double.GameWorld.newestObjectIndex == 2){
                if(double.GameWorld.totalLevel == 2){
                    double.GameWorld.levelObjectList.push("object"+(hall.GlobalFuncs.getRandomNumberBefore(3)));
                }
            }
        }else {
            var middleIndex = parseInt(double.GameWorld.newestObjectIndex - double.GameWorld.newestObjectIndex*double.GameWorld.generalConfig.objectStageTopScale);
            middleIndex = middleIndex < 2 ? 2 : middleIndex;
            var bottomIndex = parseInt(middleIndex - double.GameWorld.newestObjectIndex*double.GameWorld.generalConfig.objectStageMiddleScale);
            bottomIndex = bottomIndex < 1 ? 1 : bottomIndex;
            var tempNumber;
            var addNumber;
            var tempObject;
            while (double.GameWorld.levelObjectList.length < 5){
                tempNumber = Math.random();
                if(tempNumber > 1-double.GameWorld.generalConfig.objectStageTopProbability){
                    addNumber = hall.GlobalFuncs.getRandomNumberBefore(double.GameWorld.newestObjectIndex-middleIndex+1)+middleIndex;
                }else if(tempNumber > 1-double.GameWorld.generalConfig.objectStageTopProbability-double.GameWorld.generalConfig.objectStageMiddleProbability){
                    addNumber = hall.GlobalFuncs.getRandomNumberBefore(middleIndex-bottomIndex+1)+bottomIndex;
                }else {
                    addNumber = hall.GlobalFuncs.getRandomNumberBefore(bottomIndex+1);
                }
                tempObject = "object"+addNumber;
                if(double.GameWorld.levelObjectList.indexOf(tempObject) == -1){
                    double.GameWorld.levelObjectList.push("object"+addNumber);
                }
            }
        }
        //添加宝箱
        var boxNowConfig;
        var subIndex;
        for (i = 0 ; i < double.GameWorld.boxConfig.length ; i ++){
            boxNowConfig = double.GameWorld.boxConfig[i];
            if(boxNowConfig.minLevel <= double.GameWorld.totalLevel && boxNowConfig.maxLevel >= double.GameWorld.totalLevel){
                if(boxNowConfig.minLevel == double.GameWorld.totalLevel){
                    hall.GlobalFuncs.setInLocalStorage(double.gameModel.GAME_STAGE_BOX_NUMBER,0);
                    if(Math.random() < boxNowConfig.probability){
                        hall.GlobalFuncs.setInLocalStorage(double.gameModel.GAME_STAGE_BOX_NUMBER,1);
                        subIndex = hall.GlobalFuncs.getRandomNumberBefore(3)+1;
                        double.GameWorld.levelObjectList[subIndex] = "box";
                    }
                }else {
                    var nowStage = boxNowConfig.maxLevel-boxNowConfig.subAmount +1;
                    while (nowStage > double.GameWorld.totalLevel){
                        nowStage -= boxNowConfig.subAmount;
                    }
                    if(nowStage != hall.GlobalFuncs.ReadNumFromLocalStorage(double.gameModel.GAME_STAGE_BOX_LEVEL,0)){
                        hall.GlobalFuncs.setInLocalStorage(double.gameModel.GAME_STAGE_BOX_NUMBER,0);
                        hall.GlobalFuncs.setInLocalStorage(double.gameModel.GAME_STAGE_BOX_LEVEL,nowStage);
                        if(Math.random() < boxNowConfig.probability){
                            hall.GlobalFuncs.setInLocalStorage(double.gameModel.GAME_STAGE_BOX_NUMBER,1);
                            subIndex = hall.GlobalFuncs.getRandomNumberBefore(3)+1;
                            double.GameWorld.levelObjectList[subIndex] = "box";
                        }
                    }else {
                        var nowNumber = hall.GlobalFuncs.ReadNumFromLocalStorage(double.gameModel.GAME_STAGE_BOX_NUMBER,0);
                        if(nowNumber < boxNowConfig.mostBoxNumber && Math.random() < boxNowConfig.probability){
                            hall.GlobalFuncs.setInLocalStorage(double.gameModel.GAME_STAGE_BOX_NUMBER,nowNumber+1);
                            subIndex = hall.GlobalFuncs.getRandomNumberBefore(3)+1;
                            double.GameWorld.levelObjectList[subIndex] = "box";
                        }
                    }
                }
                break;
            }
        }

        // double.GameWorld.levelObjectList = ["object0","object1","object2","object3","object4"];
        double.GameWorld.levelObjectNumber = double.GameWorld.levelObjectList.length;
        this.levelProgressNode.x = 0;
        for (i = 0 ; i < this.levelProgressSpriteList.length ; i ++){
            this.levelProgressSpriteList[i].node.active = true;
            this.levelProgressSpriteList[i].spriteFrame = this.levelProgressSpriteFrameList[0];
            if(double.GameWorld.levelObjectList.length < 5 && i == 4){
                this.levelProgressSpriteList[i].node.active = false;
                this.levelProgressNode.x = 17;
            }
            if(double.GameWorld.levelObjectList.length < 4 && (i == 3 || i == 4)){
                this.levelProgressSpriteList[i].node.active = false;
                this.levelProgressNode.x = 35;
            }
        }
    },
    getNextObjectType : function () {
        double.GameWorld.objectType = double.GameWorld.levelObjectList[double.GameWorld.levelObjectList.length-double.GameWorld.levelObjectNumber];

        var bloodList = double.GameWorld.objectConfig[double.GameWorld.objectType].bloodList;
        if(double.GameWorld.totalLevel >= 16){
            double.GameWorld.objectBlood = hall.GlobalFuncs.getRandomNumberBefore(bloodList[1]-bloodList[0]+1)+bloodList[0];
        }else if(double.GameWorld.totalLevel == 1){
            double.GameWorld.objectBlood = bloodList[2];
        }else {
            double.GameWorld.objectBlood = hall.GlobalFuncs.getRandomNumberBefore(5)-2+parseInt((double.GameWorld.totalLevel/15*(bloodList[3]-bloodList[2]))+bloodList[2]);
        }

        this.objectBloodAll = double.GameWorld.objectBlood;
        this.progressNodeSprite.fillRange = 1;

        if(double.GameWorld.totalLevel <= double.GameWorld.generalConfig.stageOneLevel){
            double.GameWorld.objectInitializedSpeed = double.GameWorld.objectConfig[double.GameWorld.objectType].initializedSpeed[0];
            double.GameWorld.objectAccelerated = double.GameWorld.objectConfig[double.GameWorld.objectType].accelerated[0];
            double.GameWorld.objectHAccelerated = double.GameWorld.objectConfig[double.GameWorld.objectType].hAaccelerated[0];
        }else if(double.GameWorld.totalLevel <= double.GameWorld.generalConfig.stageTwoLevel){
            double.GameWorld.objectInitializedSpeed = double.GameWorld.objectConfig[double.GameWorld.objectType].initializedSpeed[1];
            double.GameWorld.objectAccelerated = double.GameWorld.objectConfig[double.GameWorld.objectType].accelerated[1];
            double.GameWorld.objectHAccelerated = double.GameWorld.objectConfig[double.GameWorld.objectType].hAaccelerated[1];
        }else {
            double.GameWorld.objectInitializedSpeed = double.GameWorld.objectConfig[double.GameWorld.objectType].initializedSpeed[2];
            double.GameWorld.objectAccelerated = double.GameWorld.objectConfig[double.GameWorld.objectType].accelerated[2];
            double.GameWorld.objectHAccelerated = double.GameWorld.objectConfig[double.GameWorld.objectType].hAaccelerated[2];
        }

        this.objectWin.changeObjectType();
        double.GameWorld.gameLevelUp = false;
    },
    getNextObjectTypeNewer : function () {
        double.GameWorld.objectType = double.GameWorld.levelObjectList[double.GameWorld.levelObjectNumber-1];
        double.GameWorld.objectBlood = 9-double.GameWorld.levelObjectNumber*2;
        //TODO:
        // double.GameWorld.objectBlood = 18;
        this.objectBloodAll = double.GameWorld.objectBlood;
        this.progressNodeSprite.fillRange = 1;
        double.GameWorld.objectInitializedSpeed = double.GameWorld.objectConfig[double.GameWorld.objectType].initializedSpeed[0];
        double.GameWorld.objectAccelerated = double.GameWorld.objectConfig[double.GameWorld.objectType].accelerated[0];
        double.GameWorld.objectHAccelerated = double.GameWorld.objectConfig[double.GameWorld.objectType].hAaccelerated[0];
        if(double.GameWorld.levelObjectNumber == 3){
            this.tipsLabel.string = "<color=#000000><b>点击开枪！</b></c>";
        }else if(double.GameWorld.levelObjectNumber == 2){
            this.tipsLabel.string = "<color=#000000><b>双手同时点击！</b></c>";
        }else {
            this.tipsLabel.string = "<color=#000000><b>保持物品在屏幕内！</b></c>";
        }
        this.objectWin.changeObjectType();
        double.GameWorld.gameLevelUp = false;

        this.leftGunNewerNode.active = true;
        this.rightGunNewerNode.active = true;
        hall.GlobalFuncs.btnScaleEffectLeft(this.leftGunNewerNode,1.6);
        hall.GlobalFuncs.btnScaleEffectRight(this.rightGunNewerNode,1.6);
    },

    openFireLeftButtonTouchEnded : function () {
        if(double.GameWorld.gameOver || double.GameWorld.gamePause || double.GameWorld.gameLevelUp){
            return;
        }
        if(double.GameWorld.objectNowLocationY < -cc.director.getWinSize().height/2){
            return;
        }
        this.leftGunWin.sendArrow();
        this.objectWin.sendArrowForObject(0,this.leftGunWin.getGunAngle());

        // if(debugMode){
        //     this.openFireRightButtonTouchEnded();
        // }
    },
    openFireRightButtonTouchEnded : function () {
        if(double.GameWorld.gameOver || double.GameWorld.gamePause || double.GameWorld.gameLevelUp){
            return;
        }
        if(double.GameWorld.objectNowLocationY < -cc.director.getWinSize().height/2){
            return;
        }
        this.rightGunWin.sendArrow();
        this.objectWin.sendArrowForObject(1,this.rightGunWin.getGunAngle());
    },
    receiveArrow : function () {
        //增加分数
        double.GameWorld.totalScore += double.GameWorld.totalLevel;
        this.scoreLabel.string = double.GameWorld.totalScore+"";

        double.GameWorld.objectBlood -= double.GameWorld.gunDamageBonus;
        if(double.GameWorld.objectBlood <= 0){
            double.GameWorld.gameLevelUp = true;
            this.objectWin.removeAllGunHitAniNodeChild();
            this.progressNodeSprite.fillRange = 0;
            double.GameWorld.levelObjectNumber --;
            this.objectWin.gameBomb();
        }else {
            this.progressNodeSprite.fillRange = (double.GameWorld.objectBlood/this.objectBloodAll);
        }
    },
    afterObjectBomb : function () {
        if(double.GameWorld.gameOver || double.GameWorld.gamePause){
            return;
        }
        this.levelNumberUp();
    },
    levelNumberUp : function () {
        double.GlobalFuncs.getFriendInfo();
        this.objectWin.removeAllGunHitAniNodeChild();
        this.levelProgressSpriteList[double.GameWorld.levelObjectList.length-double.GameWorld.levelObjectNumber-1].spriteFrame = this.levelProgressSpriteFrameList[1];
        hall.GlobalFuncs.btnScaleEffectOnce(this.levelProgressSpriteList[double.GameWorld.levelObjectList.length-double.GameWorld.levelObjectNumber-1],1.13);
        if(double.GameWorld.levelObjectNumber <= 0){
            if(hall.GlobalFuncs.ReadBoolFromLocalStorage(double.gameModel.IS_NEW_USER,true)){
                //新手引导结束
                double.AudioHelper.playEffect(double.EffectPath_mp3.doubleNewerEffect);
                this.tipsLabel.string = "<color=#000000><b>棒呆了!!！</b></c>";
                hall.GlobalFuncs.setInLocalStorage(double.gameModel.IS_NEW_USER,false);
                var caidaiNode = cc.instantiate(this.caidaiPrefab);
                this.node.addChild(caidaiNode);
                var ani = caidaiNode.getComponent(cc.Animation);
                var animation = ani.getAnimationState(ani.getClips()[0].name);
                var that = this;
                animation.once("finished", function () {
                    caidaiNode.removeFromParent();
                    that.doubleInfoNode.active = false;
                    that.objectNode.active = false;
                    that.leftGunNewerNode.active = false;
                    that.rightGunNewerNode.active = false;
                    double.GlobalFuncs.showTitlePage();
                });
                animation.play();
            }else {
                this.levelUp();
            }
        }else {
            if(hall.GlobalFuncs.ReadBoolFromLocalStorage(double.gameModel.IS_NEW_USER,true) || double.GameWorld.testObject){
                this.getNextObjectTypeNewer();
            }else {
                this.getNextObjectType();
            }
        }
    },
    levelUp : function () {
        double.GlobalFuncs.getFriendInfo();
        var nextNewLevel = 0;
        var addTemp = 2;
        while (nextNewLevel < double.GameWorld.totalLevel){
            nextNewLevel += addTemp;
            if(nextNewLevel == double.GameWorld.totalLevel){
                double.GameWorld.newestObjectIndex ++;
                hall.GlobalFuncs.setInLocalStorage(double.gameModel.GAME_NEWEST_OBJECT_INDEX,double.GameWorld.newestObjectIndex);
                break;
            }
            addTemp ++;
        }

        double.GameWorld.totalLevel ++;
        hall.GlobalFuncs.setInLocalStorage(double.gameModel.GAME_LEVEL ,double.GameWorld.totalLevel);

        //闯关成功后展示闯关成功页面，字样向上滑动，出现老虎机
        double.GlobalFuncs.showNewResult();
    },
    gameOver : function () {
        this.objectWin.removeAllGunHitAniNodeChild();
        double.GameWorld.gameOver = true;

        //失败动画
        if(double.GameWorld.objectNowLocationX < -this.windowWidth/2){
            this.gameFailNode.x = -this.windowWidth/2+this.gameFailNodeGap;
            this.gameFailNode.y = double.GameWorld.objectNowLocationY;
            if(this.gameFailNode.y < -this.windowHeight/2+this.gameFailNodeGap){
                this.gameFailNode.y = -this.windowHeight/2+this.gameFailNodeGap;
            }else if(this.gameFailNode.y > this.windowHeight/2-this.gameFailNodeGap){
                this.gameFailNode.y = this.windowHeight/2-this.gameFailNodeGap;
            }
        }else if(double.GameWorld.objectNowLocationX > this.windowWidth/2){
            this.gameFailNode.x = this.windowWidth/2-this.gameFailNodeGap;
            this.gameFailNode.y = double.GameWorld.objectNowLocationY;
            if(this.gameFailNode.y < -this.windowHeight/2+this.gameFailNodeGap){
                this.gameFailNode.y = -this.windowHeight/2+this.gameFailNodeGap;
            }else if(this.gameFailNode.y > this.windowHeight/2-this.gameFailNodeGap){
                this.gameFailNode.y = this.windowHeight/2-this.gameFailNodeGap;
            }
        }else if(double.GameWorld.objectNowLocationY > this.windowHeight/2){
            this.gameFailNode.y = this.windowHeight/2-this.gameFailNodeGap;
            this.gameFailNode.x = double.GameWorld.objectNowLocationX;
            if(this.gameFailNode.x < -this.windowWidth/2+this.gameFailNodeGap){
                this.gameFailNode.x = -this.windowWidth/2+this.gameFailNodeGap;
            }else if(this.gameFailNode.x > this.windowWidth/2-this.gameFailNodeGap){
                this.gameFailNode.x = this.windowWidth/2-this.gameFailNodeGap;
            }
        }else {
            this.gameFailNode.y = -this.windowHeight/2+this.gameFailNodeGap;
            this.gameFailNode.x = double.GameWorld.objectNowLocationX;
            if(this.gameFailNode.x < -this.windowWidth/2+this.gameFailNodeGap){
                this.gameFailNode.x = -this.windowWidth/2+this.gameFailNodeGap;
            }else if(this.gameFailNode.x > this.windowWidth/2-this.gameFailNodeGap){
                this.gameFailNode.x = this.windowWidth/2-this.gameFailNodeGap;
            }
        }
        this.gameFailNode.active = true;
        this.gameFailCount = 60;
    },
    gameOverShowWindow : function () {
        if(double.GameWorld.gamePause){
            return;
        }
        this.gameFailNode.active = false;
        if(double.GameWorld.objectType == "box"){
            double.GameWorld.gameOver = false;
            double.GameWorld.levelObjectNumber --;
            this.levelNumberUp();
            return;
        }
        //游戏结束
        if(hall.GlobalFuncs.ReadBoolFromLocalStorage(double.gameModel.IS_NEW_USER,true)){
            this.getNextObjectTypeNewer();
            double.GameWorld.gameOver = false;
        }else {
            this.objectNode.active = false;
            this.doubleInfoNode.active = false;
            if(double.GameWorld.levelObjectNumber == 5 || double.GlobalFuncs.getRewardOpenType("resurgence") == "omit"){
                double.GlobalFuncs.showGameOverResult();
            }else {
                double.GlobalFuncs.showResurgence();
            }
        }
    },
    //从暂停页回到主页
    gameOverNoChange : function () {
        this.objectWin.removeAllGunHitAniNodeChild();
        double.GameWorld.gameOver = true;
        this.objectNode.active = false;
        this.doubleInfoNode.active = false;
    },
    gamePause : function () {
        this.leftGunNewerNode.active = false;
        this.rightGunNewerNode.active = false;
        this.leftGunNewerNode.stopAllActions();
        this.rightGunNewerNode.stopAllActions();
        double.GameWorld.gamePause = true;
        double.GlobalFuncs.showGamePause();
    },

    //超越好友
    setSurpassNodeInit : function () {
        var openDataContext = double.GlobalFuncs.getOpenData();
        if(!openDataContext){
            return;
        }
        this.sharedCanvas = openDataContext.canvas;
        this.sharedCanvas.width  = 150;
        this.sharedCanvas.height = 200;

        if(!this.surpassTexture){
            this.surpassTexture = new cc.Texture2D();
        }
        if(!this.surpassSpriteFrame){
            this.surpassSpriteFrame = new cc.SpriteFrame(this.surpassTexture);
        }
        this.surpassSprite.spriteFrame = this.surpassSpriteFrame;
    },
    setSurpassNode : function () {
        this.surpassTexture.initWithElement(this.sharedCanvas);
        this.surpassTexture.handleLoadedTexture();
        this.surpassSprite.spriteFrame._refreshTexture(this.surpassTexture);
    },

    update : function(dt) {
        this.surpassCount ++ ;
        if(this.surpassCount >= 10){
            this.surpassCount = 0;
            this.setSurpassNode();
        }
        if(this.gameFailCount){
            this.gameFailCount -- ;
            if(this.gameFailCount == 0){
                this.gameOverShowWindow();
            }
        }
    },

    onDestroy : function () {
        // this.arrowPool = null;
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }
});
