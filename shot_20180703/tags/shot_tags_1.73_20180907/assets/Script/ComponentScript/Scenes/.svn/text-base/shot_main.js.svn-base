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
    ctor :function () {
        // this.userDataList = null;
        this.crazyTimePanel = null;
        this.jugglingSchemaPanel = null;
        this.addScoreAniPool = null;
    },

    properties:{
        windowWidth : 0,
        bgSprite : {
            default : null,
            type : cc.Sprite
        },
        bottomBucket : {
            default : null,
            type : cc.Node
        },
        topBucket : {
            default : null,
            type : cc.Node
        },
        gunNode : {
            default : null,
            type : cc.Node
        },
        bottomBucketWin: {
            default: null,
            serializable: false
        },
        topBucketWin: {
            default: null,
            serializable: false
        },
        gunNodeWin: {
            default: null,
            serializable: false
        },
        isFirstThompsonRunning : true,
        openFireButton : {
            default : null,
            type : cc.Button
        },
        emptyGunCount : 0,
        laserSprite : {
            default : null,
            type : cc.Sprite
        },

        gameInfoNode : {
            default : null,
            type : cc.Node
        },
        toolNode : {
            default : null,
            type : cc.Node
        },
        //Info
        levelLabel : {
            default : null,
            type : cc.Label
        },
        nowScoreLabel : {
            default : null,
            type : cc.Label
        },
        bestScoreLabel : {
            default : null,
            type : cc.Label
        },
        bulletCountNode : {
            default : null,
            type : cc.Node
        },
        bulletCountLabel : {
            default : null,
            type : cc.Label
        },
        infiniteBulletSprite : {
            default : null,
            type : cc.Sprite
        },
        //道具
        infiniteBulletButton : {
            default : null,
            type : cc.Button
        },
        infiniteBulletCountLabel : {
            default : null,
            type : cc.Label
        },
        laserButton : {
            default : null,
            type : cc.Button
        },
        laserCountLabel : {
            default : null,
            type : cc.Label
        },
        //倒计时
        infiniteBulletTimeNode : {
            default : null,
            type : cc.Node
        },
        infiniteBulletTimeSprite : {
            default : null,
            type : cc.Sprite
        },
        countDownLabel : {
            default : null,
            type : cc.Label
        },
        //即将超越
        surpassNode : {
            default : null,
            type : cc.Node
        },
        surpassTexture : cc.Texture2D,
        surpassSpriteFrame : cc.SpriteFrame,
        surpassSprite : cc.Sprite,
        surpassCount : 0,

        //看视频分享得子弹
        addBulletButton : {
            default : null,
            type : cc.Button
        },
        addBulletButtonLabel : {
            default : null,
            type : cc.Label
        },
        addBulletButtonNumberLabel : {
            default : null,
            type : cc.Label
        },
        addBulletSprite : {
            default : null,
            type : cc.Sprite
        },
        addBulletSpriteList : [cc.SpriteFrame],

        //Animation
        levelAniNode : {
            default : null,
            type : cc.Node
        },
        levelChangeLabel : {
            default : null,
            type : cc.Label
        },
        doubleHitAniNode : {
            default : null,
            type:cc.Node
        },
        doubleHit1 : {
            default : null,
            type : cc.Label
        },
        doubleHitLayout : {
            default : null,
            type : cc.Layout
        },
        doubleHit : {
            default : null,
            type : cc.Label
        },
        infoAniNode : {
            default : null,
            type:cc.Node
        },
        addScoreAniPrefab :{
            default : null,
            type : cc.Prefab
        },
        bulletAniNode : {
            default : null,
            type:cc.Node
        },
        addBulletLabel : {
            default : null,
            type : cc.Label
        },
        addBulletType : "",

        addBannerCount : 0,

        infiniteFullTime : 0,
        infiniteTime : 0,

        doubleHitContinueNode : {
            default : null,
            type : cc.Node
        },
        doubleHitContinueLabel : {
            default : null,
            type : cc.Label
        },
        doubleHitContinueCount : 0,

        crazyTimeStartCount : 0,
        crazyTimeInCount : 0,
        crazyTimeOutCount : 0,
        crazyTimeEndCount : 0,
        rightDistance : 0,
        crazyTimeFullTime : 0,
        crazyTimeCountDown : 0,

        debugCount : 0,

        doubleHitAniAction0 : false,
        doubleHitAniAction1 : false,

        isOnTouch : false,

        gameOverCount : 0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad : function () {
        this.setSurpassNodeInit();

        var winSize = cc.director.getWinSize();
        this.windowWidth = winSize.width;
        var bucketWindow = this.bottomBucket.getComponent('shot_bucket');
        bucketWindow.parentScene = this;
        this.bottomBucketWin = bucketWindow;
        var bucketWindow2 = this.topBucket.getComponent('shot_bucket');
        bucketWindow2.parentScene = this;
        this.topBucketWin = bucketWindow2;
        this.gunNodeWin = this.gunNode.getComponent('shot_gun');
        this.gunNodeWin.parentScene = this;
        this.openFireButton.node.on(cc.Node.EventType.TOUCH_START, this.openFireButtonTouchStart, this, true);
        // this.openFireButton.node.on(cc.Node.EventType.TOUCH_MOVE, this.openFireButtonTouchMoved, this, true);
        this.openFireButton.node.on(cc.Node.EventType.TOUCH_CANCEL, this.openFireButtonTouchCancel, this, true);
        this.openFireButton.node.on(cc.Node.EventType.TOUCH_END, this.openFireButtonTouchEnded, this, true);
        ty.NotificationCenter.listen(shot.EventType.GAME_START,this.gameStart, this);
        ty.NotificationCenter.listen(shot.EventType.GAME_LEVEL_UP,this.levelUp, this);

        //TODO:TEST
        if(shot.GameWorld.initBulletType){
            shot.GlobalFuncs.setBulletType(shot.GameWorld.initBulletType);
        }else {
            shot.GlobalFuncs.setBulletType("bulletType0");
        }

        ty.NotificationCenter.listen(shot.EventType.REWARD_VIDEO_COMPLETE,this.rewardVideoComplete, this);
        ty.NotificationCenter.listen(shot.EventType.REWARD_VIDEO_COMPLETE_ERROR,this.rewardVideoCompleteError, this);

        //道具
        this.updateInfiniteByllet();
        this.updateGrenadeAiming();
        ty.NotificationCenter.listen(shot.EventType.UPDATE_INFINITEBULLET_NUMBER,this.updateInfiniteByllet, this);
        ty.NotificationCenter.listen(shot.EventType.UPDATE_GRENADE_NUMBER,this.updateGrenadeAiming, this);
        ty.NotificationCenter.listen(shot.EventType.RESURGENCE_RESULT,this.useToolResult, this);
        ty.NotificationCenter.listen(shot.EventType.STOP_DOUBLEHIT_COUNTDOWN,this.stopDoubleHitCountDown,this);

        ty.NotificationCenter.listen(shot.EventType.REPLAY_BG_MUSIC,this.rePlayBgMusic, this);
        ty.NotificationCenter.listen(shot.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);

        this.bestScoreLabel.string = "最佳:"+ shot.Share.shareKeywordReplace.bestScoreForSelf;


        var isNew = hall.GlobalFuncs.ReadBoolFromLocalStorage(shot.gameModel.IS_NEW_USER,true);
        if(isNew){
            shot.GlobalFuncs.showNewTipsPanel();
        }else {
            this.gameStart("start",true);
        }
        shot.AudioHelper.playMusic(shot.EffectPath_mp3.musicGame,true);

        this.addScoreAniPool = new cc.NodePool();
        for (var k = 0 ; k < 8 ; k ++){
            var addAniNode = cc.instantiate(this.addScoreAniPrefab);
            this.addScoreAniPool.put(addAniNode);
        }

        if(!shot.GameWorld.gunnerShareSchemeConfig || shot.GameWorld.gunnerShareSchemeConfig.showBanner){
            this.gameInfoNode.y = 60;
            this.toolNode.y = 60;
            this.gunNode.y = 110;
            this.addBannerCount = 120;
        }
    },

    //超越好友
    setSurpassNodeInit : function () {
        var openDataContext = shot.GlobalFuncs.getOpenData();
        if(!openDataContext){
            return;
        }
        this.sharedCanvas = openDataContext.canvas;
        this.sharedCanvas.width  = 300;
        this.sharedCanvas.height = 60;

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
    changeTheBestScore : function () {
        if(shot.Share.shareKeywordReplace.bestScoreForSelf < shot.GameWorld.totalScore){
            shot.Share.shareKeywordReplace.bestScoreForSelf = shot.GameWorld.totalScore;
            shot.GlobalFuncs.upDateRankData(shot.GameWorld.totalScore);
            shot.gameModel.saveLevelScore();
        }
        this.bestScoreLabel.string = "最佳:"+ shot.Share.shareKeywordReplace.bestScoreForSelf;
    },

    // 道具+得12颗子弹
    updateInfiniteByllet:function(){
        this.infiniteBulletCountLabel.string = "无限子弹 x" + hall.ME.udataInfo.infiniteBulletCount;
    },
    updateGrenadeAiming : function () {
        this.laserCountLabel.string = "手榴弹 x" + hall.ME.udataInfo.grenadeCount;
    },
    onBullet : function () {
        if(debugMode && shot.GameWorld.canUserLaser){
            shot.GameWorld.bulletCount += 50;
            return;
        }
        if(shot.GameWorld.gameLevel <= 2){
            hall.MsgBoxManager.showToast({title : "当前关卡已使用无限子弹道具"});
            return;
        }
        if(shot.GameWorld.bulletInfinite){
            hall.MsgBoxManager.showToast({title : "当前关卡已使用无限子弹道具"});
            return;
        }
        if(shot.GameWorld.infiniteBulletTime >= shot.GameWorld.toolUserTimeConfig.infiniteBulletTime){
            hall.MsgBoxManager.showToast({title : "一关只能使用"+shot.GameWorld.toolUserTimeConfig.infiniteBulletTime+"次哦~"});
            return;
        }
        if(!hall.ME.udataInfo.infiniteBulletCount){
            shot.gameModel.getUniqueBoxId("item:1371","wxzd");
            return;
        }
        shot.gameModel.consumeAssets(1,"item:1371");
    },
    onGrenade : function () {
        if(shot.GameWorld.grenadeRunning){
            hall.MsgBoxManager.showToast({title : "正在使用手榴弹"});
            return;
        }
        if(shot.GameWorld.grenadeTime >= shot.GameWorld.toolUserTimeConfig.grenadeTime){
            hall.MsgBoxManager.showToast({title : "已经超过使用次数"});
            return;
        }
        if(!hall.ME.udataInfo.grenadeCount){
            shot.gameModel.getUniqueBoxId("item:1390","sld");
            return;
        }
        shot.gameModel.consumeAssets(1,"item:1390");
    },
    onDoubleHitContinue : function () {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["ComboContinue"]);
        shot.GlobalFuncs.showPropBox(null,true);
        shot.GameWorld.doubleHitCountDownTime = false;
    },
    stopDoubleHitCountDown : function () {
        this.doubleHitContinueNode.active = false;
        this.doubleHitContinueCount = 0;
        shot.GameWorld.doubleHitCountDownTime = false;
    },
    useToolResult : function (result) {
        // {
//     "cmd":"game",
//     "result":{
//     "action":"consume_assets",
//         "gameId":106,
//         "userId":10249,
//         "clientId":"H5_5.1_weixin.weixin.0-hall106.weixin.rich",
//         "success":1,
//         "itemId":"item:1371",
//         "assetsCounts":0
// }
// }
        if(result.success == 1){
            if(result.itemId == "item:1371"){
                shot.GameWorld.bulletInfinite = true;
                this.bulletCountLabel.string = "";
                this.infiniteBulletSprite.node.active = true;
                this.infiniteBulletCountLabel.string = "无限子弹 x" + hall.ME.udataInfo.infiniteBulletCount;
                this.infiniteTime = shot.GameWorld.propertyConfig.infiniteBullet.time * 60;
                this.infiniteFullTime = shot.GameWorld.propertyConfig.infiniteBullet.time * 60;
                this.infiniteBulletTimeNode.active = true;
                this.countDownLabel.string = shot.GameWorld.propertyConfig.infiniteBullet.time;
                shot.GameWorld.infiniteBulletTime ++;
            }else if(result.itemId == "item:1390"){
                this.laserCountLabel.string = "手榴弹 x" + hall.ME.udataInfo.grenadeCount;
                shot.GameWorld.grenadeRunning = true;
                shot.GameWorld.grenadeTime ++;

                shot.AudioHelper.playEffect(shot.EffectPath_mp3.grenadeBegin);
                this.gunNodeWin.onActionGrenade(this.afterGrenadeAction.bind(this));
            }else {
                this.laserSprite.node.active = true;
                this.laserCountLabel.string = "瞄准器 x" + hall.ME.udataInfo.laserAimingCount;
                shot.GameWorld.laserTime ++;
            }
        }else {
            hall.MsgBoxManager.showToast({title : "使用道具失败"});
        }
    },
    afterGrenadeAction : function () {
        shot.GameWorld.nowBulletPenetrate = 24;
        this.bottomBucketWin.receiveGrenade();
        if(shot.GameWorld.bucketCount == 2){
            this.topBucketWin.receiveGrenade();
        }
        this._shakeScreen();
        // hall.GlobalFuncs.waggleEffect(this.gameInfoNode,0,0);
        // hall.GlobalFuncs.waggleEffect(this.toolNode,0,0);
        // hall.GlobalFuncs.waggleEffect(this.bottomBucket,0,293);
        // hall.GlobalFuncs.waggleEffect(this.topBucket,0,293);
    },
    _shakeScreen: function() {

        // this.view.ccbRootNode.setTag(999);
        var initPos = this.topBucket.getPosition();
        var initPos2 = this.bgSprite.node.getPosition();
        // var length = hall.GlobalFuncs.getRandomTween(4, 8);
        var length = hall.GlobalFuncs.getRandomNumberBefore(5)+4;
        length *= 2;

        var actions = [];
        var actions2 = [];
        var maxInShake = 18;
        var minInShake = 7;
        for (var i=0; i<length; i+=2) {
            //创建动画
            var moveInX = hall.GlobalFuncs.getRandomNumberBefore(maxInShake-minInShake+1)+minInShake;
            if (hall.GlobalFuncs.getRandomNumberBefore(4)+1 <= 2) {
                moveInX *= -1;
            }
            var moveInY = hall.GlobalFuncs.getRandomNumberBefore(maxInShake-minInShake+1)+minInShake;
            if (hall.GlobalFuncs.getRandomNumberBefore(4)+1 <= 2) {
                moveInY *= -1;
            }
            actions[i] = cc.moveTo(0.07, cc.p(initPos.x+moveInX,initPos.y+ moveInY));
            actions[i+1] = cc.moveTo(0.07, initPos);
            actions2[i] = cc.moveTo(0.07, cc.p(initPos2.x+moveInX,initPos2.y+ moveInY));
            actions2[i+1] = cc.moveTo(0.07, initPos2);
        }
        var dstAction = cc.sequence(actions);
        var dstAction2 = cc.sequence(actions2);
        this.topBucket.runAction(dstAction);
        this.bottomBucket.runAction(dstAction);
        this.bgSprite.node.runAction(dstAction2);
    },

    getBucketRoundSpeedIn : function () {
        if(shot.GameWorld.bucketCount == 2){
            return this.topBucketWin.getRoundSpeed();
        }
        return this.bottomBucketWin.getRoundSpeed();
    },
    setAddBulletButton : function () {
        if(shot.gameModel.getAllCheckConfig()){
            this.addBulletButton.node.active = false;
            return;
        }

        this.addBulletButtonNumberLabel.string = "子弹+"+shot.GameWorld.toolUserTimeConfig.addBullet.addCount;

        if(hall.adManager.canPlay){
            if(shot.GameWorld.addBulletTime >= shot.GameWorld.toolUserTimeConfig.addBullet.time){
                this.addBulletButton.node.active = false;
                return;
            }
            var dayCount = hall.GlobalFuncs.ReadNumFromLocalStorage(shot.gameModel.DAY_VIDEO_TIME,0);
            if(dayCount >= 9){
                if(ty.UserInfo.isInBSGS){
                    this.addBulletButton.node.active = false;
                    return;
                }else {
                    this.addBulletType = "share";
                    this.addBulletButton.node.active = true;
                    this.addBulletButtonLabel.string = "分享到群";
                }
            }else {
                this.addBulletType = "ad";
                this.addBulletButton.node.active = true;
                this.addBulletButtonLabel.string = "看视频";
            }
        }else {
            if(ty.UserInfo.isInBSGS){
                this.addBulletButton.node.active = false;
                return;
            }else {
                this.addBulletType = "share";
                this.addBulletButton.node.active = true;
                this.addBulletButtonLabel.string = "分享到群";
            }
        }

        if(this.addBulletType == "share"){
            this.addBulletSprite.spriteFrame = this.addBulletSpriteList[0];
        }else {
            this.addBulletSprite.spriteFrame = this.addBulletSpriteList[1];
        }
    },
    onAddBullet : function () {
        if(shot.GameWorld.gameLevel == 1 || shot.GameWorld.gameLevel == 2)
        {
            return;
        }
        if(shot.GameWorld.addBulletTime >= shot.GameWorld.toolUserTimeConfig.addBullet.time){
            return;
        }

        if(this.addBulletType == "share"){
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["shareAddBullet"]);
            shot.Share.shareWithType(shot.Share.onShareType.clickStatShareTypeAddBullet);
        }else if(this.addBulletType == "ad"){
            var dayCount = hall.GlobalFuncs.ReadNumFromLocalStorage(shot.gameModel.DAY_VIDEO_TIME,0);
            hall.GlobalFuncs.setInLocalStorage(shot.gameModel.DAY_VIDEO_TIME,dayCount+1);

            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["adAddBullet"]);
            hall.adManager.showRewardedVideo("addBullet");
        }
    },
    rewardVideoComplete : function(isEnd){
        if(hall.adManager.rewardedVideoType != "addBullet"){
            return;
        }
        if(isEnd){
            shot.GameWorld.addBulletTime ++;
            shot.GameWorld.bulletCount += shot.GameWorld.toolUserTimeConfig.addBullet.addCount;
            this.bulletCountLabel.string = ""+shot.GameWorld.bulletCount;
            if(shot.GameWorld.addBulletTime == shot.GameWorld.toolUserTimeConfig.addBullet.time){
                this.addBulletButton.node.active = false;
            }
        }else {
            hall.MsgBoxManager.showToast({"title":"视频播放未完成"});
        }
        this.showBanner();
        this.setAddBulletButton();
    },
    rewardVideoCompleteError : function (errorMsg) {
        if(hall.adManager.rewardedVideoType != "addBullet"){
            return;
        }
        hall.MsgBoxManager.showToast({"title":errorMsg});
        this.showBanner();
        this.setAddBulletButton();
    },
    playAnimationAfterShareWithType : function (shareType) {
        if (shareType && shareType == shot.Share.onShareType.clickStatShareTypeAddBullet) {
            this.showBanner();
            this.setAddBulletButton();
            shot.GameWorld.addBulletTime ++;
            shot.GameWorld.bulletCount += shot.GameWorld.toolUserTimeConfig.addBullet.addCount;
            this.bulletCountLabel.string = ""+shot.GameWorld.bulletCount;
            if(shot.GameWorld.addBulletTime == shot.GameWorld.toolUserTimeConfig.addBullet.time){
                this.addBulletButton.node.active = false;
            }
        }
    },

    //游戏过程
    gameStart : function (type,isFirst) {
        shot.GlobalFuncs.setDayOriginGameData();
        shot.GlobalFuncs.showAdBtnWithTag(5002,"normalLevel");
        this.bestScoreLabel.string = "最佳:"+ shot.Share.shareKeywordReplace.bestScoreForSelf;
        this.debugCount = 0;
        shot.GameWorld.gameOver = false;
        this.isOnTouch = false;
        // this.stopThompsonRunning();
        shot.GlobalFuncs.showOrigin();
        this.setSurpassNodeInit();
        if(type == "start"){
            //游戏数据归零
            this.bottomBucketWin.removeAllBottles();
            this.topBucketWin.removeAllBottles();
            shot.GameWorld.gameLevel = 1;
            shot.GameWorld.lastTreasureLevel = 0;
            shot.GameWorld.bottleCount = 0;
            shot.GameWorld.bucketCount = 0;
            shot.GameWorld.doubleHitCount = 0;
            shot.GameWorld.totalScore = 0;
            //道具、权益使用次数归零
            shot.GameWorld.resurgenceTime = 0;
            shot.GameWorld.infiniteBulletTime = 0;
            // shot.GameWorld.laserTime = 0;
            // shot.GameWorld.grenadeTime = 0;
            // shot.GameWorld.addBulletTime = 0;
            shot.GameWorld.doubleHitContinueTime = 0;

            this.addBulletButton.node.active = false;
            shot.GameWorld.bulletInfinite = true;
            if(debugMode){
                shot.GameWorld.gameLevel = shot.GameWorld.initGameLevel;
                if(shot.GameWorld.initGameLevel > 1){
                    shot.GameWorld.bulletCount += 50;
                }
            }
            this.bulletCountLabel.string = "";
            this.infiniteBulletSprite.node.active = true;
            this.gameStartWithLevel();
            if(!isFirst){
                this.showBanner();
            }
            hall.GlobalFuncs.setInLocalStorage(shot.gameModel.OPEN_BOX_CLOSE_TIME,0);
        }else {
            shot.GameWorld.bulletCount += 12;
            shot.GameWorld.resurgenceTime ++;
            this.bulletCountLabel.string = ""+shot.GameWorld.bulletCount;
            this.infiniteBulletSprite.node.active = false;
            this.showBanner();
        }
        this.nowScoreLabel.string = shot.GameWorld.totalScore;
    },
    gameStartWithLevel : function () {
        shot.GameWorld.infiniteBulletTime = 0;
        shot.GameWorld.grenadeTime = 0;

        var level = shot.GameWorld.gameLevel;
        if(level == 1 || level == 2 || this.infiniteTime){
            shot.GameWorld.bulletInfinite = true;
        }
        // shot.GameWorld.bulletInfinite = level == 1 || level == 2;
        this.laserSprite.node.active = level <= 5;
        var that = this;
        //关卡通知动画
        //增加子弹
        var bulletConfig = shot.GameWorld.bulletAddConfig;
        for (var i = 0 ; i < bulletConfig.length ; i ++){
            if(bulletConfig[i].minLevel <= level && bulletConfig[i].maxLevel >= level){
                shot.GameWorld.bulletCount += bulletConfig[i].bulletAddCount;
                this.bulletAniNode.active = true;
                this.addBulletLabel.string = "+"+bulletConfig[i].bulletAddCount;
                break;
            }
        }
        this.levelChangeLabel.node.x = 320;
        this.levelChangeLabel.node.active = true;
        if(level%5 == 0){
            this.levelChangeLabel.string = "BOSS关";
        }else {
            this.levelChangeLabel.string = "第"+level+"关";
        }
        var levelAni = this.levelAniNode.getComponent(cc.Animation);
        var levelAniClipName = levelAni.getClips()[0].name;
        var levelAnimation = levelAni.getAnimationState(levelAniClipName);
        levelAnimation.once("finished", function () {
            that.levelLabel.string = "第"+level+"关";
            that.levelChangeLabel.node.active = false;
            that.changeBucketWithLevel(level);

            if(shot.GameWorld.bulletInfinite){
                that.bulletCountLabel.string = "";
                that.infiniteBulletSprite.node.active = true;
            }else {
                that.bulletCountLabel.string = ""+shot.GameWorld.bulletCount;
                that.infiniteBulletSprite.node.active = false;
            }
            that.bulletAniNode.active = false;

            //替换武器,初始化子弹
            shot.GameWorld.bulletRunningTimeBottom = 0;//子弹连发属性
            shot.GameWorld.bulletRunningTimeTop = 0;//子弹连发属性
            if(shot.GameWorld.bulletType != "bulletType0"){ //武器
                if(shot.GameWorld.doubleGunUseTime  < shot.GameWorld.doubleGunUseTimeCan){
                    shot.GameWorld.doubleGunUseTime ++;
                }else {
                    hall.MsgBoxManager.showToast({"title":"武器已失效"});
                    shot.GlobalFuncs.setBulletType("bulletType0");
                }
            }
        });
        levelAnimation.play();
    },
    changeBucketWithLevel : function (level) {
        shot.GameWorld.gamePause = false;
        this.isOnTouch = false;
        shot.GameWorld.gunFireIntervalNow = 0;
        // shot.GameWorld.gunFireIntervalNowT = 0;
        // shot.GameWorld.isOnThompsonRunning = false;
        var levelScore = 0;
        if(level == 1 || level == 2){
            levelScore = shot.GameWorld.scoreLevelConfig.specificLevel12;
        }else {
            var gapScore = shot.GameWorld.scoreLevelConfig.decreaseScore*parseInt((level-1)/5);
            var addScore = shot.GameWorld.scoreLevelConfig.initialScore + gapScore;
            levelScore = addScore > shot.GameWorld.scoreLevelConfig.limitScore ? shot.GameWorld.scoreLevelConfig.limitScore : addScore;
        }
        // hall.LOGW("==shot_main==","===level=="+level+"===score==="+levelScore);
        var bottleLifeCount = shot.GameWorld.bottleConfig;
        var bottleList = [];
        var chooseBottleList = ["green","purple"];
        //BOSS关卡添加红瓶子
        if(level%5 == 0){
            bottleList.push("red");
            chooseBottleList.push("orange");
            levelScore -= bottleLifeCount["red"].lifeCount;
        }
        // //
        var i;
        //按照概率添加宝箱瓶子
        var canHaveTreasure = true;
        if(shot.GameWorld.treasureConfig && shot.GameWorld.treasureConfig.onlyConfig.length){
            var onlyConfig;
            for (i = 0 ; i < shot.GameWorld.treasureConfig.onlyConfig.length ; i ++){
                onlyConfig = shot.GameWorld.treasureConfig.onlyConfig[i];
                if(onlyConfig.minLevel > shot.GameWorld.lastTreasureLevel){
                    break;
                }
                if(shot.GameWorld.lastTreasureLevel <= onlyConfig.maxLevel){
                    if (level <= onlyConfig.maxLevel){
                        canHaveTreasure = false;
                    }
                    break;
                }
            }
        }
        if(canHaveTreasure){
            if(shot.GameWorld.treasureConfig && shot.GameWorld.treasureConfig.probabilityConfig.length){
                var levelConfig;
                var boxConfig ;
                for (i = 0 ; i < shot.GameWorld.treasureConfig.probabilityConfig.length ; i ++){
                    levelConfig = shot.GameWorld.treasureConfig.probabilityConfig[i];
                    if(levelConfig.minLevel <= level && levelConfig.maxLevel >= level){
                        boxConfig = levelConfig.boxList;
                        for (var j = 0 ; j < boxConfig.length ; j ++){
                            var boxBottle = boxConfig[j];
                            if(Math.random() < boxBottle.probability){
                                if(shot.GameWorld.bottleNameList.indexOf(boxBottle.treasureBoxType) > -1){
                                    shot.GameWorld.lastTreasureLevel = level;
                                    bottleList.push(boxBottle.treasureBoxType);
                                    levelScore -= bottleLifeCount[boxBottle.treasureBoxType].lifeCount;
                                    break;
                                }
                            }
                        }
                        break;
                    }
                }
            }
        }

        if(level == 1){
            chooseBottleList = ["green"];
        }else if(level == 2){
            chooseBottleList = ["purple"];
        }
        while (levelScore > 0){
            var type = chooseBottleList[hall.GlobalFuncs.getRandomNumberBefore(chooseBottleList.length)];
            var decScore = bottleLifeCount[type].lifeCount;
            if(levelScore >= decScore){
                bottleList.push(type);
                levelScore -= decScore;
            }
            if(levelScore == 1 && level == 2){
                break;
            }
        }
        //生成木桶瓶子数组
        var bucketCount = level >10 ? 2 : 1;
        shot.GameWorld.bucketCount = bucketCount;
        shot.GameWorld.bottleCount = bottleList.length;
        var changeIndex;
        if(bucketCount == 1){
            this.topBucket.active = false;
            this.topBucketWin.setRotateTimeWithType('none');
            this.bottomBucketWin.setRotateTimeWithType('only');
            var onlyList = [];
            for (i = 0 ; i < 12 ; i ++){
                if(i < bottleList.length){
                    onlyList.push(bottleList[i]);
                }else {
                    changeIndex = hall.GlobalFuncs.getRandomNumberBefore(i);
                    onlyList[i] = onlyList[changeIndex];
                    onlyList[changeIndex] = 'none';
                }
            }
            this.bottomBucketWin.setBottlesWithListNew(onlyList);
        }else {
            this.topBucket.active = true;
            this.topBucketWin.setRotateTimeWithType('top');
            this.bottomBucketWin.setRotateTimeWithType('bottom');
            var twoList = [];
            for (i = 0 ; i < 24 ; i ++){
                if(i < bottleList.length){
                    twoList.push(bottleList[i]);
                }else {
                    changeIndex = hall.GlobalFuncs.getRandomNumberBefore(i);
                    twoList[i] = twoList[changeIndex];
                    twoList[changeIndex] = 'none';
                }
            }
            this.topBucketWin.setBottlesWithListNew(twoList.slice(0,12));
            this.bottomBucketWin.setBottlesWithListNew(twoList.slice(12));
            // hall.LOGW("=====","===level==="+level+"===bottleList==="+JSON.stringify(twoList));
        }
    },
    openFireButtonTouchStart : function () {
        if(this.isOnTouch){
            return;
        }
        this.isOnTouch = true;
        if(shot.GameWorld.gunFireInterval && !shot.GameWorld.gamePause && !shot.GameWorld.gameOver){//汤姆逊冲锋枪按住连发,机枪
            // shot.GameWorld.gunFireIntervalNow = shot.GameWorld.gunFireInterval;
            shot.GameWorld.gunFireIntervalNow = shot.GameWorld.gunFireInterval;
            // shot.GameWorld.gunFireIntervalNowT = shot.GameWorld.gunFireInterval;
            // shot.GameWorld.isOnThompsonRunning = true;
            this.openFireAction();
        }
    },
    openFireButtonTouchCancel : function () {
        this.isOnTouch = false;
        this.stopThompsonRunning();
    },
    openFireButtonTouchEnded : function(){
        // this.gunFireIntervalCount = 0;
        if(!this.isOnTouch){
            return;
        }
        this.isOnTouch = false;
        this.stopThompsonRunning();
        if(shot.GameWorld.bulletRunningTimeBottom || shot.GameWorld.gunFireInterval){ //特殊枪型
            return;
        }
        if(shot.GameWorld.gameOver || shot.GameWorld.gamePause ){
            return;
        }

        this.openFireAction();
    },
    openFireAction : function () {
        // this.gunFireIntervalCount = 0;
        this.emptyGunCount = 0;
        shot.GameWorld.bulletRunningTimeBottom = shot.GameWorld.bulletRunningTimeCan;//子弹连发属性
        shot.GameWorld.bulletRunningTimeTop = shot.GameWorld.bulletRunningTimeCan;//子弹连发属性

        this.openFireBulletAction();
        this.openFireGunAction();
        // this.gunNodeWin.openFire();
        if(!shot.GameWorld.jugglingSchema){
            if(shot.GameWorld.gunFireInterval && !this.isFirstThompsonRunning){
                this.bottomBucketWin.receiveBulletNew(true);
                this.topBucketWin.receiveBulletNew(true);
            }else {
                this.bottomBucketWin.receiveBulletNew();
                this.topBucketWin.receiveBulletNew();
                if(shot.GameWorld.gunFireInterval){
                    this.isFirstThompsonRunning = false;
                }
            }
        }else {
            this.jugglingSchemaPanel.receiveBullet();
        }

    },
    openFireBulletAction : function () {
        // hall.LOGW("=====","======openFireBulletAction======");
        if(shot.GameWorld.gameOver || shot.GameWorld.gamePause){
            return;
        }
        if(shot.GameWorld.jugglingSchema){
            this.jugglingSchemaPanel.changeBulletCountLabel();
            return;
        }
        if(!shot.GameWorld.bulletInfinite && !shot.GameWorld.crazyMoment){
            shot.GameWorld.bulletCount --;
            if(shot.GameWorld.bulletCount < 0){
                this.stopThompsonRunning();
                this.gameOver();
                return;
            }
            this.bulletCountLabel.string = shot.GameWorld.bulletCount+"";
            this.infiniteBulletSprite.node.active = false;
            if(shot.GameWorld.bulletCount <= 3){
                hall.GlobalFuncs.btnScaleEffectOnce(this.bulletCountLabel,1.7);
            }
        }
    },
    openFireGunAction : function () {
        try {
            wx.vibrateShort({
                success:function () {
                },
                fail : function () {
                },
                complete : function () {
                }
            });
        }catch (err){
            hall.LOGE("error:", "openFireGunAction——" + JSON.stringify(err));
        }

        this.gunNodeWin.openFire();
    },
    stopThompsonRunning : function () {
        // hall.LOGW("=====","======stopThompsonRunning======");
        shot.GameWorld.gunFireIntervalNow = 0;
        // shot.GameWorld.gunFireIntervalNowT = 0;
        // shot.GameWorld.isOnThompsonRunning = false;
        if(shot.GameWorld.gunFireInterval){//汤姆逊冲锋枪按住连发
            this.bottomBucketWin.stopRunningCount();
            if(shot.GameWorld.bucketCount == 2){
                this.topBucketWin.stopRunningCount();
            }
            // this.gunNodeWin.stopGunAni();
        }
        this.isFirstThompsonRunning = true;
    },
    emptyGunAction : function () {
        // hall.LOGW("=====","======emptyGunAction======");
        if(shot.GameWorld.crazyMoment || shot.GameWorld.gameOver){
            return;
        }
        this.emptyGunCount ++;
        if(this.emptyGunCount == shot.GameWorld.bucketCount){
            // hall.LOGW("=====","======emptyGunAction======");
            if(shot.GameWorld.doubleHitCount >= shot.GameWorld.toolUserTimeConfig.comboContinue &&
                !shot.gameModel.getAllCheckConfig() &&
            shot.GameWorld.doubleHitContinueTime < shot.GameWorld.toolUserTimeConfig.comboContinueTime){
                shot.GameWorld.doubleHitCountBest = shot.GameWorld.doubleHitCount;
                this.doubleHitContinueNode.active = true;
                this.doubleHitContinueLabel.string = "9";
                this.doubleHitContinueCount = 600;
                shot.GameWorld.doubleHitCountDownTime = true;
            }
            shot.GameWorld.doubleHitCount = 0;
            this.emptyGunCount = 0;
            if(shot.GameWorld.bulletCount == 0 && !shot.GameWorld.bulletInfinite){
                shot.GameWorld.gunFireIntervalNow = 0;
                // shot.GameWorld.gunFireIntervalNowT = 0;
                // shot.GameWorld.isOnThompsonRunning = false;
                this.gameOver();
            }
        }
    },
    stopDoubleHitAnimation : function (aniIndex) {
        if(this["doubleHitAniAction"+aniIndex]){
            var ani = this.doubleHitAniNode.getComponent(cc.Animation);
            var clipName = ani.getClips()[aniIndex].name;
            var animation = ani.getAnimationState(clipName);
            animation.stop();
        }
    },
    bottleHit : function (bottleInfo) {
        // hall.LOGW("=====","======bottleHit======");
        if(shot.GameWorld.crazyMoment){
            if(bottleInfo.lifeCount == 0){
                this.addScoreWithAnimation(shot.GameWorld.bottleConfig[bottleInfo.type].crazyBottleScore);
            }
            return;
        }

        //击中动画
        shot.GameWorld.doubleHitCount += 1;
        var aniIndex = 0;
        if(shot.GameWorld.doubleHitCount == 1){
            this.doubleHit1.node.active = true;
            this.doubleHitLayout.node.active = false;
        }else {
            this.doubleHit1.node.active = false;
            this.doubleHitLayout.node.active = true;
            this.doubleHit.string = "+"+shot.GameWorld.doubleHitCount;
            aniIndex = 1;
        }
        this.stopDoubleHitAnimation(aniIndex);
        this["doubleHitAniAction"+aniIndex] = true;
        var ani = this.doubleHitAniNode.getComponent(cc.Animation);
        var clipName = ani.getClips()[aniIndex].name;
        var animation = ani.getAnimationState(clipName);
        var that = this;
        animation.once("finished", function () {
            that["doubleHitAniAction"+aniIndex] = false;
        });
        animation.play();

        shot.GameWorld.totalScore += shot.GameWorld.doubleHitCount;
        shot.GlobalFuncs.getFriendInfo();
        // this.getTheNextSurpassInfo();
        this.nowScoreLabel.string = shot.GameWorld.totalScore;
        // hall.LOGW("=====","===totalScore==="+shot.GameWorld.totalScore);
        if(shot.GameWorld.bulletCount <= 0 && !shot.GameWorld.bulletInfinite) {//最后一颗子弹打中,但是还有不止一个瓶子
            if(shot.GameWorld.bottleCount > 1 || (shot.GameWorld.bottleCount == 1 && bottleInfo.lifeCount > 0)){
                this.gameOver();
            }
        }
    },
    playBottomDeadAnimation : function () {
        this.bottomBucketWin.playDeadAnimation();
    },
    addScoreWithAnimation : function (score) {
        shot.GameWorld.totalScore += score;
        var aniNode ;
        if(this.addScoreAniPool.size() > 0){
            aniNode = this.addScoreAniPool.get();
        }else {
            aniNode = cc.instantiate(this.addScoreAniPrefab);
        }
        var addAniW = aniNode.getComponent("shot_addScoreAni");
        addAniW.setAddScore(score);
        this.infoAniNode.addChild(aniNode);
        var ani2 = aniNode.getComponent(cc.Animation);
        var anim2 = ani2.getAnimationState("addScore");
        var that = this;
        anim2.once("finished", function () {
            that.nowScoreLabel.string = shot.GameWorld.totalScore;
            that.addScoreAniPool.put(aniNode);
            aniNode.removeFromParent();
        });
        anim2.play();
    },
    levelUp : function () {
        this.isOnTouch = false;
        if(shot.GameWorld.gunFireIntervalNow){
            this.stopThompsonRunning();
        }
        shot.GameWorld.gunFireIntervalNow = 0;
        // shot.GameWorld.isOnThompsonRunning = false;
        if(shot.GameWorld.gameGetBox){
            //宝箱瓶
            return;
        }
        if(shot.GameWorld.crazyMoment){
            if(shot.GameWorld.bottleCount == 0 && !shot.GameWorld.gamePause){
                this.crazyTimePanel.crazyTimeGood();
                return;
            }else {
                shot.GameWorld.gamePause = true;
                shot.GameWorld.bottleCount = 0;
                this.infiniteBulletTimeNode.active = false;
                shot.GameWorld.crazyMoment = false;
                this.crazyTimePanel = null;
            }
        }
        else if(shot.GameWorld.jugglingSchema){
            // if(shot.GameWorld.bottleCount == 0 && !shot.GameWorld.gamePause){
            //     this.jugglingSchemaPanel.jugglingSchemaGood();
            //     return;
            // }else {
            shot.GameWorld.gamePause = true;
            shot.GameWorld.bottleCount = 0;
            this.infiniteBulletTimeNode.active = false;
            shot.GameWorld.jugglingSchema = false;
            this.jugglingSchemaPanel = null;
            // }
        }
        else {
            if(shot.GameWorld.gameLevel != 1 && shot.GameWorld.gameLevel != 2){
                //增加剩余子弹的分数动画
                if(!shot.GameWorld.bulletInfinite){
                    this.addScoreWithAnimation(shot.GameWorld.bulletCount);
                }
            }
            shot.GameWorld.gamePause = true;
            if(shot.GameWorld.crazyMomentConfig.crazyLevelList.indexOf(shot.GameWorld.gameLevel) > -1){
                shot.GameWorld.crazyMoment = true;
                this.removeAllNodeForCrazy();
                return;
            }
            if(shot.GameWorld.jugglingSchemaConfig.jugglingLevelList.indexOf(shot.GameWorld.gameLevel) > -1){
                shot.GameWorld.jugglingSchema = true;
                this.removeAllNodeForJuggling();
                return;
            }
        }

        //增加子弹
        if(shot.GameWorld.gameLevel == 1){
            shot.GameWorld.bulletCount = 0;
            this.bulletCountLabel.string = "";
            this.infiniteBulletSprite.node.active = true;
        }else if(shot.GameWorld.gameLevel == 2){
            shot.GameWorld.bulletCount = 0;
            this.setAddBulletButton();
        }

        shot.GameWorld.bulletInfinite = false;

        shot.GameWorld.gameLevel ++;
        this.gameStartWithLevel();
        this.changeTheBestScore();
    },
    gameOver : function () {
        hall.LOGW("=====","======gameOver======");
        shot.GameWorld.gameOver = true;
        shot.GameWorld.bulletInfinite = false;
        shot.GameWorld.bulletCount = 0;
        this.gameOverCount = 60;
        this.isOnTouch = false;
        shot.GameWorld.gunFireIntervalNow = 0;
    },
    showGameOver : function () {
        hall.adManager.hideBannerAd();
        shot.GlobalFuncs.hideAdBtnWithTag(5002,true);

        if(shot.GameWorld.gameGetBox){
            return;
        }
        var reTypeList;
        if(ty.UserInfo.isInBSGS){
            reTypeList = shot.GameWorld.toolUserTimeConfig.resurgenceType.bsgs;
        }else {
            reTypeList = shot.GameWorld.toolUserTimeConfig.resurgenceType.nBsgs;
        }
        if(reTypeList[0] == "ad" && !hall.adManager.canPlay){
            shot.GlobalFuncs.showGameOverWithMyScore();
            return;
        }
        if(shot.GameWorld.resurgenceTime >= shot.GameWorld.toolUserTimeConfig.resurgenceTime || shot.gameModel.getAllCheckConfig()){
            shot.GlobalFuncs.showGameOverWithMyScore();
        }else {
            shot.GlobalFuncs.showResurgence();
        }
    },

    //展示疯狂时刻
    removeAllNodeForCrazy : function () {
        // this.levelLabel.string = "疯狂时刻";
        this.bulletCountLabel.string = "";
        this.infiniteBulletSprite.node.active = true;
        this.crazyTimeStartCount = 120;
        // hall.adManager.destroyBannerAd();
        hall.adManager.hideBannerAd();
        shot.GlobalFuncs.hideAdBtnWithTag(5002,true);
        this.infiniteTime = 0;
        this.infiniteBulletTimeNode.active = false;
        this.doubleHitContinueNode.active = false;
        // this.doubleHitContinueCount = 0;
        shot.GameWorld.doubleHitCountDownTime = false;
    },
    showCrazyTime : function () {
        cc.loader.loadRes('shot_prefabs/shot_crazyTime', function (err, prefab) {
            var preFabNode = cc.instantiate(prefab);
            cc.director.getScene().addChild(preFabNode);
            shot.GlobalFuncs.setToCenter(preFabNode);
            var com = preFabNode.getComponent('shot_crazyTime');
            com.parentScene = this;
            this.crazyTimePanel = com;
        }.bind(this));
    },
    setCrazyTimeBucket : function () {
        this.crazyTimeInCount = 60;
        var crazyBucketCon = shot.GameWorld.crazyMomentConfig.crazyLevelConfig;
        var bucketCon;
        for (var i = 0 ; i < crazyBucketCon.length ; i ++){
            if(crazyBucketCon[i].crazyLevel == shot.GameWorld.gameLevel){
                bucketCon = crazyBucketCon[i];
            }
        }
        this.crazyTimeFullTime = bucketCon.crazyTime;
        shot.GameWorld.crazyBonus = bucketCon.bonusScore;

        shot.GameWorld.bucketCount = bucketCon.crazyBucketList.length;
        if(bucketCon.crazyBucketList.length == 1){
            this.topBucket.active = false;
            this.topBucketWin.setCrazyRotateTimeWithType('none');
            this.bottomBucketWin.setCrazyRotateTimeWithType('bottom',bucketCon.crazyBucketList[0]);
        }else {
            this.topBucket.active = true;
            this.bottomBucketWin.setCrazyRotateTimeWithType('bottom',bucketCon.crazyBucketList[0]);
            this.topBucketWin.setCrazyRotateTimeWithType('top',bucketCon.crazyBucketList[1]);
        }
    },
    startCrazyTime : function () {
        this.infiniteBulletTimeNode.active = true;
        this.crazyTimeCountDown = this.crazyTimeFullTime;
        this.countDownLabel.string = this.crazyTimeCountDown;
    },
    removeCrazyWhenEnd : function () {
        this.crazyTimeOutCount = 60;
    },
    crazyTimeEndEnter : function () {
        this.crazyTimeEndCount = 60;
        if(!shot.GameWorld.bulletInfinite){
            this.bulletCountLabel.string = shot.GameWorld.bulletCount+"";
            this.infiniteBulletSprite.node.active = false;
        }
    },
    addCrazyTimeScore : function () {
        this.crazyTimeCountDown = 0;
        this.infiniteBulletTimeNode.active = false;

        // shot.GameWorld.totalScore += shot.GameWorld.crazyBottleScore;

        if(shot.GameWorld.bottleCount == 0){
            this.addScoreWithAnimation(shot.GameWorld.crazyBonus);
        }

        this.bottomBucketWin.removeAllCrazyBottles();
        this.topBucketWin.removeAllCrazyBottles();
        shot.GlobalFuncs.getFriendInfo();
        // this.getTheNextSurpassInfo();

        if(this.doubleHitContinueCount){
            shot.GameWorld.doubleHitCountDownTime = true;
            this.doubleHitContinueNode.active = true;
        }

        if(shot.GameWorld.gunnerShareSchemeConfig && !shot.gameModel.getAllCheckConfig()){
            this.showBanner(shot.GameWorld.gunnerShareSchemeConfig.refreshBanner);
        }else {
            this.showBanner();
        }
    },
    //疯狂时刻计时
    crazyMomentAnimation : function () {
        if(this.crazyTimeStartCount){
            this.crazyTimeStartCount --;
            if(this.crazyTimeStartCount<60){
                this.rightDistance = 4*(60-this.crazyTimeStartCount);
                this.removeCrazyNode();
            }
            if(this.crazyTimeStartCount == 0){
                this.showCrazyTime();
            }
        }
        if(this.crazyTimeInCount){
            this.crazyTimeInCount --;
            this.rightDistance = 4*this.crazyTimeInCount;
            this.removeCrazyNode2();
            if(this.crazyTimeInCount == 0){
                this.crazyTimePanel.startCrazyTime();
            }
        }
        if(this.crazyTimeOutCount){
            this.crazyTimeOutCount --;
            this.rightDistance = 4*(60-this.crazyTimeOutCount);
            this.removeCrazyNode3();
            if(this.crazyTimeOutCount == 0){
                this.crazyTimePanel.crazyTimeAddScore();
            }
        }
        if(this.crazyTimeEndCount){
            this.crazyTimeEndCount --;
            this.rightDistance = 4*this.crazyTimeEndCount;
            this.removeCrazyNode4();
            if(this.crazyTimeEndCount == 0){
                this.crazyTimePanel.crazyTimeOver();
            }
        }
    },
    removeCrazyNode : function () {
        this.levelLabel.node.x = -300-this.rightDistance;
        this.nowScoreLabel.node.x = -300-this.rightDistance;
        this.bestScoreLabel.node.x = -300-this.rightDistance;
        this.surpassNode.x = -300-this.rightDistance;
        this.addBulletButton.node.x = -264-this.rightDistance;

        this.infiniteBulletTimeNode.x = 220+this.rightDistance;
        this.bulletCountNode.x = 220+this.rightDistance;
        this.infiniteBulletButton.node.x = 238+this.rightDistance;
        this.laserButton.node.x = 238+this.rightDistance;

        this.bottomBucket.y = 293+this.rightDistance*5;
        this.topBucket.y = 293+this.rightDistance*5;
    },
    removeCrazyNode2 : function () {
        this.bottomBucket.y = 293+this.rightDistance*5;
        this.topBucket.y = 293+this.rightDistance*5;

        this.nowScoreLabel.node.x = -300-this.rightDistance;

        this.infiniteBulletTimeNode.x = 220+this.rightDistance;
        this.bulletCountNode.x = 220+this.rightDistance;
    },
    removeCrazyNode3 : function () {
        this.nowScoreLabel.node.x = -300-this.rightDistance;

        this.infiniteBulletTimeNode.x = 220+this.rightDistance;
        this.bulletCountNode.x = 220+this.rightDistance;

        this.bottomBucket.y = 293+this.rightDistance*5;
        this.topBucket.y = 293+this.rightDistance*5;
    },
    removeCrazyNode4 : function () {
        this.levelLabel.node.x = -300-this.rightDistance;
        this.nowScoreLabel.node.x = -300-this.rightDistance;
        this.bestScoreLabel.node.x = -300-this.rightDistance;
        this.surpassNode.x = -300-this.rightDistance;
        this.addBulletButton.node.x = -264-this.rightDistance;

        this.infiniteBulletTimeNode.x = 220+this.rightDistance;
        this.bulletCountNode.x = 220+this.rightDistance;
        this.infiniteBulletButton.node.x = 238+this.rightDistance;
        this.laserButton.node.x = 238+this.rightDistance;

        this.bottomBucket.y = 293+this.rightDistance*5;
        this.topBucket.y = 293+this.rightDistance*5;
    },

    //飞碟模式
    removeAllNodeForJuggling : function () {
        // this.levelLabel.string = "飞碟模式";
        // this.bulletCountLabel.string = "";
        // this.infiniteBulletSprite.node.active = true;
        this.crazyTimeStartCount = 120;
        // hall.adManager.destroyBannerAd();
        hall.adManager.hideBannerAd();
        shot.GlobalFuncs.hideAdBtnWithTag(5002,true);
        this.infiniteTime = 0;
        this.infiniteBulletTimeNode.active = false;
        this.doubleHitContinueNode.active = false;
        shot.GameWorld.doubleHitCountDownTime = false;
    },
    addJugglingSchemaNode : function () {
        cc.loader.loadRes('shot_prefabs/shot_throw', function (err, prefab) {
            var preFabNode = cc.instantiate(prefab);
            cc.director.getScene().addChild(preFabNode);
            shot.GlobalFuncs.setToCenter(preFabNode);
            var com = preFabNode.getComponent('shot_throw');
            com.parentScene = this;
            this.jugglingSchemaPanel = com;
            // com.changeOriginData();
        }.bind(this));
    },
    addJugglingSchemaScore : function () {
        this.infiniteBulletTimeNode.active = false;

        this.addScoreWithAnimation(shot.GameWorld.jugglingBottleScore);

        shot.GlobalFuncs.getFriendInfo();

        if(this.doubleHitContinueCount){
            shot.GameWorld.doubleHitCountDownTime = true;
            this.doubleHitContinueNode.active = true;
        }

        if(shot.GameWorld.gunnerShareSchemeConfig && !shot.gameModel.getAllCheckConfig()){
            this.showBanner(shot.GameWorld.gunnerShareSchemeConfig.refreshBanner);
        }else {
            this.showBanner();
        }
    },

    endJugglingSchema : function () {
        this.crazyTimeEndCount = 120
    },
    jugglingSchemaAnimation :function() {
        if(this.crazyTimeStartCount){
            this.crazyTimeStartCount --;
            if(this.crazyTimeStartCount<60){
                this.rightDistance = 4*(60-this.crazyTimeStartCount);
                this.removeCrazyNode();
            }
            if(this.crazyTimeStartCount == 0){
                this.addJugglingSchemaNode();
            }
        }
        if(this.crazyTimeEndCount){
            this.crazyTimeEndCount --;
            this.rightDistance = 4*this.crazyTimeEndCount;
            this.removeCrazyNode();
            if(this.crazyTimeEndCount == 0){
                this.addJugglingSchemaScore();
                this.levelUp();
                // this.crazyTimePanel.crazyTimeOver();
            }
        }
    },

    showBanner : function (refresh) {
        hall.adManager.showBannerAd("adunit-53ba999759aa14de",refresh);
        shot.GlobalFuncs.showAdBtnWithTag(5002,"normalLevel");
        // shot.curBannerAd.style.left = 0;
        // top = res.height;
        // if(ty.UserInfo.systemType == ty.UserInfo.SYSTEMTYPE.iPhoneXType){
        //     shot.curBannerAd.style.top = screenHeight- top - 30;
        // }else {
        //     shot.curBannerAd.style.top = screenHeight- top;
        // }
        // hall.adManager.showBanner({x:0,y:shot.curBannerAd.style.top});
        // this.bottomBucket.y = 293+this.normalNodeUp;
        // this.topBucket.y = 293+this.normalNodeUp;
        // this.gameInfoNode.y = this.normalNodeUp;
        // this.toolNode.y = this.normalNodeUp;
        // this.gunNode.y = this.gunNodeUp;
    },

    update : function(dt) {
        this.surpassCount ++ ;
        if(this.surpassCount >= 10){
            this.surpassCount = 0;
            this.setSurpassNode();
        }
        if(this.addBannerCount){
            this.addBannerCount --;
            if(this.addBannerCount == 0){
                this.showBanner();
            }
        }
        if(shot.GameWorld.gunFireIntervalNow && !shot.GameWorld.gamePause && !shot.GameWorld.gameOver && !shot.GameWorld.jugglingSchema){
            shot.GameWorld.gunFireIntervalNow --;
            if(shot.GameWorld.gunFireIntervalNow == 1){
                shot.GameWorld.gunFireIntervalNow = shot.GameWorld.gunFireInterval;
                this.openFireAction();
            }
        }
        //游戏结束
        if(shot.GameWorld.gameOver){
            if(this.gameOverCount > 0){
                this.gameOverCount -- ;
                if(this.gameOverCount == 0){
                    this.showGameOver();
                }
            }
            return;
        }
        //续连击按钮
        if(this.doubleHitContinueCount && shot.GameWorld.doubleHitCountDownTime){
            this.doubleHitContinueCount --;
            if(this.doubleHitContinueCount % 60 == 40){
                this.doubleHitContinueLabel.string = this.doubleHitContinueCount/60 >>  0;
            }
            if(this.doubleHitContinueCount >= 570){
                this.doubleHitContinueNode.x = -(this.doubleHitContinueCount-570)*4-this.windowWidth/2
            }
            if(this.doubleHitContinueCount <= 30){
                this.doubleHitContinueNode.x = -(30-this.doubleHitContinueCount)*4-this.windowWidth/2
            }
            if(this.doubleHitContinueCount <= 0 ){
                this.doubleHitContinueNode.active = false;
                shot.GameWorld.doubleHitCountDownTime = false;
            }
        }
        //疯狂时刻(进度条)
        if(shot.GameWorld.crazyMoment && !shot.GameWorld.gamePause){
            if(this.crazyTimeCountDown != 0){
                this.crazyTimeCountDown -= dt;
                this.infiniteBulletTimeSprite.fillRange = (this.crazyTimeCountDown/this.crazyTimeFullTime);
                if(this.crazyTimeCountDown%1 < 0.15){
                    this.countDownLabel.string = this.crazyTimeCountDown >> 0;
                    this.crazyTimePanel.setCountDownEnd(this.countDownLabel.string);
                }
                if(this.crazyTimeCountDown <= 0){
                    this.crazyTimeCountDown = 0;
                    this.crazyTimePanel.crazyTimeOut();
                    this.infiniteBulletTimeNode.active = false;
                }
            }
            return;
        }
        //疯狂时刻(动画)
        if(shot.GameWorld.crazyMoment){
            this.crazyMomentAnimation();
        }

        //飞碟模式
        if(shot.GameWorld.jugglingSchema){
            this.jugglingSchemaAnimation();
        }
        //无限子弹倒计时
        if(this.infiniteTime){
            this.infiniteTime --;
            if(this.infiniteTime == 0){
                this.infiniteBulletTimeNode.active = false;
                if(shot.GameWorld.bulletInfinite){
                    shot.GameWorld.bulletInfinite = false;
                    this.bulletCountLabel.string = ""+shot.GameWorld.bulletCount;
                    this.infiniteBulletSprite.node.active = false;
                }
            }else {
                if(this.infiniteTime % 60 == 0){
                    this.countDownLabel.string = ""+ (this.infiniteTime/60 >> 0);
                }
                this.infiniteBulletTimeSprite.fillRange = (this.infiniteTime/this.infiniteFullTime);
            }
        }

    },
    rePlayBgMusic:function(){

        hall.LOGW("==rePlayBgMusic===","=====rePlayBgMusicrePlayBgMusic=====");

        shot.AudioHelper.playMusic(shot.EffectPath_mp3.musicGame,true);
        // shot.AudioHelper.rePlayMusic();
    },

    onDebug : function () {
        this.debugCount ++;
        if(this.debugCount == 10){
            debugMode = true;
            shot.GlobalFuncs.showDebugPanel();
            this.debugCount = 0;
        }
    },

    onDestroy : function () {
        shot.GlobalFuncs.hideAdBtnWithTag(5002,true);
        this.crazyTimePanel = null;
        shot.GameWorld.initBulletType = null;
        this.addScoreAniPool.clear();
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }

    // openFireButtonTouchBegan : function(){
    //
    // },
    // openFireButtonTouchMoved : function(){
    //
    // },
    // openFireButtonTouchCancel : function(){
    //
    // },
    // start () {
    //
    // },

});
