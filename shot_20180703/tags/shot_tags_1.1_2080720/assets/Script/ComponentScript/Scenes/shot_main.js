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
        this.userDataList = null;
        this.crazyTimePanel = null;
        this.addScoreAniPool = null;
    },

    properties:{
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
        gunSprite : {
            default : null,
            type : cc.Sprite
        },
        gunSpriteList : [cc.SpriteFrame],
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
        openFireButton : {
            default : null,
            type : cc.Button
        },
        emptyGunCount : 0,
        laserSprite : {
            default : null,
            type : cc.Sprite
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
        theNextInfoNode : {
            default : null,
            type : cc.Node
        },
        theNextAvatarSprite : {
            default : null,
            type : cc.Sprite
        },
        theNextNameLabel : {
            default : null,
            type : cc.Label
        },
        theNextScoreLabel : {
            default : null,
            type : cc.Label
        },
        theNextIndex : 0,
        theNextUserScore : 0,
        theFirstLabel : {
            default : null,
            type : cc.Label
        },

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
        // addScoreLabel : {
        //     default : null,
        //     type : cc.Label
        // },
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

        infiniteFullTime : 0,
        infiniteTime : 0,

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
        var bucketWindow = this.bottomBucket.getComponent('shot_bucket');
        bucketWindow.parentScene = this;
        this.bottomBucketWin = bucketWindow;
        var bucketWindow2 = this.topBucket.getComponent('shot_bucket');
        bucketWindow2.parentScene = this;
        this.topBucketWin = bucketWindow2;
        this.gunNodeWin = this.gunNode.getComponent('shot_gun');
        this.openFireButton.node.on(cc.Node.EventType.TOUCH_START, this.openFireButtonTouchStart, this, true);
        // this.openFireButton.node.on(cc.Node.EventType.TOUCH_MOVE, this.openFireButtonTouchMoved, this, true);
        // this.openFireButton.node.on(cc.Node.EventType.TOUCH_CANCEL, this.openFireButtonTouchCancel, this, true);
        this.openFireButton.node.on(cc.Node.EventType.TOUCH_END, this.openFireButtonTouchEnded, this, true);
        ty.NotificationCenter.listen(shot.EventType.GAME_START,this.gameStart, this);
        ty.NotificationCenter.listen(shot.EventType.GAME_LEVEL_UP,this.levelUp, this);

        shot.GlobalFuncs.setBulletType("bulletType0");
        ty.NotificationCenter.listen(shot.EventType.REPLACE_GUN,this.replaceGunAction, this);

        //道具
        this.updateInfiniteByllet();
        this.updateLaserAiming();
        ty.NotificationCenter.listen(shot.EventType.UPDATE_INFINITEBULLET_NUMBER,this.updateInfiniteByllet, this);
        ty.NotificationCenter.listen(shot.EventType.UPDATE_LASERAIMING_NUMBER,this.updateLaserAiming, this);
        ty.NotificationCenter.listen(shot.EventType.RESURGENCE_RESULT,this.useToolResult, this);

        ty.NotificationCenter.listen(shot.EventType.REPLAY_BG_MUSIC,this.rePlayBgMusic, this);
        ty.NotificationCenter.listen(shot.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);

        var userDataList = JSON.parse(shot.GameWorld.game_friendData);
        if(userDataList && userDataList.length){
            this.userDataList = userDataList;
            for (var i = userDataList.length-1 ; i >= 0 ; i --){
                var user = userDataList[i];
                if(user.userId == ty.UserInfo.userId && ty.UserInfo.userId != 0){
                    var score = user.sumScore;
                    shot.Share.shareKeywordReplace.bestScoreForSelf = score + "";
                    break;
                }
            }
        }
        this.bestScoreLabel.string = "最佳:"+ shot.Share.shareKeywordReplace.bestScoreForSelf;

        var isNew = hall.GlobalFuncs.ReadBoolFromLocalStorage(shot.gameModel.IS_NEW_USER,true);
        if(isNew){
            shot.GlobalFuncs.showNewTipsPanel();
        }else {
            this.gameStart("start");
        }
        shot.AudioHelper.playMusic(shot.EffectPath_mp3.musicGame,true);

        this.addScoreAniPool = new cc.NodePool();
        for (var k = 0 ; k < 8 ; k ++){
            var addAniNode = cc.instantiate(this.addScoreAniPrefab);
            // var addAniW = addAniNode.getComponent("shot_addScoreAni");
            this.addScoreAniPool.put(addAniNode);
        }

        // var that = this;
        // var ani = this.infoAniNode.getComponent(cc.Animation);
        // var clipName = ani.getClips()[0].name;
        // this.addScoreAnimation = ani.getAnimationState(clipName);
        // this.addScoreAnimation.once("finished", function () {
        //     that.nowScoreLabel.string = shot.GameWorld.totalScore;
        //     that.addScoreLabel.node.active = false;
        // });
    },
    //超越好友
    setTheNextSurpassUserInfoWithUser : function (user) {
        ty.SystemInfo.getImageWithURL(user.avatarUrl,this.theNextAvatarSprite);
        this.theNextNameLabel.string = hall.GlobalFuncs.sliceStringToLength(user.nickname,10);
        this.theNextScoreLabel.string = user.sumScore;
    },
    getTheNextSurpassInfo : function () {
        if(this.theNextIndex < 0){
            return;
        }
        if(this.theNextUserScore > shot.GameWorld.totalScore){
            return;
        }
        this.theNextIndex -- ;
        if(this.theNextIndex == -1){
            this.theNextInfoNode.active = false;
            this.theFirstLabel.node.active = true;
            //已经没有可超越的了
            return;
        }
        while (this.userDataList[this.theNextIndex].sumScore == 0 ||
        this.userDataList[this.theNextIndex].userId == ty.UserInfo.userId ||
        this.userDataList[this.theNextIndex].sumScore <= shot.GameWorld.totalScore ){
            this.theNextIndex -- ;
            if(this.theNextIndex == -1){
                this.theNextInfoNode.active = false;
                this.theFirstLabel.node.active = true;
                return;
            }
        }
        this.theNextUserScore = this.userDataList[this.theNextIndex].sumScore;
        this.setTheNextSurpassUserInfoWithUser(this.userDataList[this.theNextIndex]);
    },
    initTheNextSurpassInfo : function () {
        this.theNextInfoNode.active = false;
        this.theFirstLabel.node.active = false;
        if(this.userDataList){
            this.theNextInfoNode.active = true;
            this.theNextIndex = this.userDataList.length -1;
            var user = this.userDataList[this.theNextIndex];
            this.theNextUserScore = user.sumScore;
            this.setTheNextSurpassUserInfoWithUser(user);
        }else {
            this.theFirstLabel.node.active = true;
            this.theNextIndex = -1;
        }
    },
    changeTheBestScore : function () {
        if(shot.Share.shareKeywordReplace.bestScoreForSelf < shot.GameWorld.totalScore){
            shot.Share.shareKeywordReplace.bestScoreForSelf = shot.GameWorld.totalScore;
            shot.GlobalFuncs.upDateRankData(shot.GameWorld.totalScore);
            shot.gameModel.saveScore();
        }
        this.bestScoreLabel.string = "最佳:"+ shot.Share.shareKeywordReplace.bestScoreForSelf;
    },
    //换枪
    replaceGunAction : function (index) {
        this.gunSprite.spriteFrame = this.gunSpriteList[index];
    },
    // 道具+得12颗子弹
    updateInfiniteByllet:function(){
        this.infiniteBulletCountLabel.string = "无限子弹 x" + hall.ME.udataInfo.infiniteBulletCount;
    },
    updateLaserAiming:function(){
        this.laserCountLabel.string = "瞄准器 x" + hall.ME.udataInfo.laserAimingCount;
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
            // hall.MsgBoxManager.showToast({title : "当前没有无限子弹"});
            return;
        }
        shot.gameModel.consumeAssets(1,"item:1371");
    },
    onLaser : function () {
        if(debugMode && shot.GameWorld.canUserLaser){
            this.laserSprite.node.active = true;
            return;
        }
        if(shot.GameWorld.gameLevel <= 5){
            hall.MsgBoxManager.showToast({title : "当前关卡已使用瞄准器道具"});
            return;
        }
        if(this.laserSprite.node.active){
            hall.MsgBoxManager.showToast({title : "当前关卡已使用瞄准器道具"});
            return;
        }
        if(shot.GameWorld.laserTime >= shot.GameWorld.toolUserTimeConfig.laserTime){
            hall.MsgBoxManager.showToast({title : "已经超过使用次数"});
            return;
        }
        if(!hall.ME.udataInfo.laserAimingCount){
            shot.gameModel.getUniqueBoxId("item:1372","jgmzq");
            // hall.MsgBoxManager.showToast({title:"没有激光瞄准器了"});
            return;
        }
        shot.gameModel.consumeAssets(1,"item:1372");
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
            }else {
                this.laserSprite.node.active = true;
                this.laserCountLabel.string = "瞄准器 x" + hall.ME.udataInfo.laserAimingCount;
                shot.GameWorld.laserTime ++;
            }
        }else {
            hall.MsgBoxManager.showToast({title : "使用道具失败"});
        }
    },
    setAddBulletButton : function () {
        if(shot.gameModel.getAllCheckConfig()){
            this.addBulletButton.node.active = false;
            return;
        }
        this.addBulletButtonNumberLabel.string = "子弹+"+shot.GameWorld.toolUserTimeConfig.addBullet.addCount;
        var addBulletConfig;
        if(ty.UserInfo.isInBSGS){
            addBulletConfig = shot.GameWorld.toolUserTimeConfig.addBullet.showType.bsgsch;
        }else {
            addBulletConfig = shot.GameWorld.toolUserTimeConfig.addBullet.showType.nBsgsch;
        }
        this.addBulletButton.node.active = addBulletConfig.show == 1;
        this.addBulletButtonLabel.string = addBulletConfig.showText;
        if(addBulletConfig.type == "share"){
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
        var type;
        if(ty.UserInfo.isInBSGS){
            type = shot.GameWorld.toolUserTimeConfig.addBullet.showType.bsgsch.type;
        }else {
            type = shot.GameWorld.toolUserTimeConfig.addBullet.showType.nBsgsch.type;
        }
        if(type == "share"){
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["shareAddBullet"]);
            shot.Share.shareWithType(shot.Share.onShareType.clickStatShareTypeAddBullet);
        }else if(type == "ad"){
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["adAddBullet"]);
        }
    },
    playAnimationAfterShareWithType : function (shareType) {
        if (shareType && shareType == shot.Share.onShareType.clickStatShareTypeAddBullet) {
            shot.GameWorld.addBulletTime ++;
            shot.GameWorld.bulletCount += shot.GameWorld.toolUserTimeConfig.addBullet.addCount;
            this.bulletCountLabel.string = ""+shot.GameWorld.bulletCount;
            if(shot.GameWorld.addBulletTime == shot.GameWorld.toolUserTimeConfig.addBullet.time){
                this.addBulletButton.node.active = false;
            }
        }
    },

    //游戏过程
    gameStart : function (type) {
        this.bestScoreLabel.string = "最佳:"+ shot.Share.shareKeywordReplace.bestScoreForSelf;
        this.debugCount = 0;
        shot.GameWorld.gameOver = false;
        if(type == "start"){
            this.bottomBucketWin.removeAllBottles();
            this.topBucketWin.removeAllBottles();
            shot.GameWorld.gameLevel = 1;
            shot.GameWorld.lastTreasureLevel = 0;
            shot.GameWorld.bottleCount = 0;
            shot.GameWorld.bucketCount = 0;
            shot.GameWorld.doubleHitCount = 0;
            shot.GameWorld.totalScore = 0;
            shot.GameWorld.resurgenceTime = 0;
            shot.GameWorld.addBulletTime = 0;
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
            this.initTheNextSurpassInfo();
        }else {
            shot.GameWorld.bulletCount += 12;
            shot.GameWorld.resurgenceTime ++;
            this.bulletCountLabel.string = ""+shot.GameWorld.bulletCount;
            this.infiniteBulletSprite.node.active = false;
        }
    },
    gameStartWithLevel : function () {
        if(shot.GameWorld.bulletType != "bulletType0"){ //武器
            if(shot.GameWorld.doubleGunUseTime  < shot.GameWorld.doubleGunUseTimeCan){
                shot.GameWorld.doubleGunUseTime ++;
            }else {
                hall.MsgBoxManager.showToast({"title":"武器已失效"});
                shot.GlobalFuncs.setBulletType("bulletType0");
            }
        }
        var level = shot.GameWorld.gameLevel;
        shot.GameWorld.bulletInfinite = level == 1 || level == 2;
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
        });
        levelAnimation.play();

        shot.GameWorld.infiniteBulletTime = 0;
        shot.GameWorld.laserTime = 0;
    },
    changeBucketWithLevel : function (level) {
        shot.GameWorld.gamePause = false;
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
                                shot.GameWorld.lastTreasureLevel = level;
                                bottleList.push(boxBottle.treasureBoxType);
                                levelScore -= bottleLifeCount[boxBottle.treasureBoxType].lifeCount;
                                break;
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
    },
    openFireButtonTouchEnded : function(){
        if(!this.isOnTouch){
            return;
        }
        this.isOnTouch = false;
        if(shot.GameWorld.gameOver || shot.GameWorld.gamePause){
            return;
        }
        wx.vibrateShort({
            success:function () {
            },
            fail : function () {
            },
            complete : function () {
            }
        });
        // hall.LOGW("=====","======openFireButtonTouchEnded======");
        this.emptyGunCount = 0;
        shot.GameWorld.nowBulletPenetrate = shot.GameWorld.bulletPenetrate;
        if(!shot.GameWorld.bulletInfinite && !shot.GameWorld.crazyMoment){
            shot.GameWorld.bulletCount --;
            this.bulletCountLabel.string = shot.GameWorld.bulletCount+"";
            this.infiniteBulletSprite.node.active = false;
            if(shot.GameWorld.bulletCount <= 3){
                hall.GlobalFuncs.btnScaleEffectOnce(this.bulletCountLabel,1.7);
            }
        }
        this.gunNodeWin.openFire();
        this.bottomBucketWin.receiveBulletNew();
        this.topBucketWin.receiveBulletNew();
    },
    emptyGunAction : function () {
        if(shot.GameWorld.crazyMoment){
            return;
        }
        this.emptyGunCount ++;
        if(this.emptyGunCount == shot.GameWorld.bucketCount){
            // hall.LOGW("=====","======emptyGunAction======");
            shot.GameWorld.doubleHitCount = 0;
            this.emptyGunCount = 0;
            if(shot.GameWorld.bulletCount == 0 && !shot.GameWorld.bulletInfinite){
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
        this.getTheNextSurpassInfo();
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
                // shot.GlobalFuncs.restoreFromCrazyMoment();
            }
        }else {
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
        }
        // var that = this;
        shot.GameWorld.bulletInfinite = false;
        // if(shot.GameWorld.gameLevel != 1 && shot.GameWorld.gameLevel != 2){
        //     //增加剩余子弹的分数动画
        //     if(!shot.GameWorld.bulletInfinite){
        //         this.addScoreWithAnimation(shot.GameWorld.bulletCount);
        //     }
        // }

        //增加子弹
        if(shot.GameWorld.gameLevel == 1){
            // shot.GameWorld.bulletInfinite = true;
            shot.GameWorld.bulletCount = 0;
            this.bulletCountLabel.string = "";
            this.infiniteBulletSprite.node.active = true;
        }else if(shot.GameWorld.gameLevel == 2){
            shot.GameWorld.bulletCount = 0;
            this.setAddBulletButton();
        }
        shot.GameWorld.gameLevel ++;
        this.gameStartWithLevel();
        this.changeTheBestScore();
    },
    gameOver : function () {
        hall.LOGW("=====","======gameOver======");
        shot.GameWorld.gameOver = true;
        // shot.GameWorld.doubleHitCount = 0;
        shot.GameWorld.bulletInfinite = false;
        shot.GameWorld.bulletCount = 0;
        this.gameOverCount = 60;
    },
    showGameOver : function () {
        var isCheck = shot.gameModel.getAllCheckConfig();
        if(shot.GameWorld.resurgenceTime >= shot.GameWorld.toolUserTimeConfig.resurgenceTime || isCheck){
            shot.GlobalFuncs.showGameOverWithMyScore();
        }else {
            shot.GlobalFuncs.showResurgence();
        }
    },

    //展示疯狂时刻
    removeAllNodeForCrazy : function () {
        this.levelLabel.string = "疯狂时刻";
        this.bulletCountLabel.string = "";
        this.infiniteBulletSprite.node.active = true;
        this.crazyTimeStartCount = 120;
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
        // shot.GameWorld.crazyBottleScore = bucketCon.crazyBottleScore;

        // shot.GlobalFuncs.setCrazyProperty(bucketCon.propertyUse);

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
        shot.GameWorld.crazyBottleCount.green = 0;
        shot.GameWorld.crazyBottleCount.purple = 0;
        shot.GameWorld.crazyBottleCount.orange = 0;
        shot.GameWorld.crazyBottleCount.red = 0;
        shot.GameWorld.crazyBottleHitCount = 0;
        shot.GameWorld.crazyBottleScore = 0;
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
        this.getTheNextSurpassInfo();

        if(shot.GameWorld.bottleCount == 0){
            this.addScoreWithAnimation(shot.GameWorld.crazyBonus);
        }

        this.bottomBucketWin.removeAllCrazyBottles();
        this.topBucketWin.removeAllCrazyBottles();
    },
    //疯狂时刻计时
    removeCrazyNode : function () {
        this.nowScoreLabel.node.x = -300-this.rightDistance;
        this.bestScoreLabel.node.x = -300-this.rightDistance;
        this.surpassNode.x = -300-this.rightDistance;
        this.addBulletButton.node.x = -264-this.rightDistance;

        this.infiniteBulletTimeNode.x = 220+this.rightDistance;
        this.bulletCountNode.x = 220+this.rightDistance;
        this.infiniteBulletButton.node.x = 238+this.rightDistance;
        this.laserButton.node.x = 238+this.rightDistance;

        this.bottomBucket.y = 300+this.rightDistance*5;
        this.topBucket.y = 300+this.rightDistance*5;
    },
    removeCrazyNode2 : function () {
        this.bottomBucket.y = 300+this.rightDistance*5;
        this.topBucket.y = 300+this.rightDistance*5;

        this.nowScoreLabel.node.x = -300-this.rightDistance;

        this.infiniteBulletTimeNode.x = 220+this.rightDistance;
        this.bulletCountNode.x = 220+this.rightDistance;
    },
    removeCrazyNode3 : function () {
        this.nowScoreLabel.node.x = -300-this.rightDistance;

        this.infiniteBulletTimeNode.x = 220+this.rightDistance;
        this.bulletCountNode.x = 220+this.rightDistance;
    },
    removeCrazyNode4 : function () {
        this.nowScoreLabel.node.x = -300-this.rightDistance;
        this.bestScoreLabel.node.x = -300-this.rightDistance;
        this.surpassNode.x = -300-this.rightDistance;
        this.addBulletButton.node.x = -264-this.rightDistance;

        this.infiniteBulletTimeNode.x = 220+this.rightDistance;
        this.bulletCountNode.x = 220+this.rightDistance;
        this.infiniteBulletButton.node.x = 238+this.rightDistance;
        this.laserButton.node.x = 238+this.rightDistance;
    },

    update : function(dt) {
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
        //疯狂时刻
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
        //疯狂时刻开始时移除相关Node
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
        //无限子弹倒计时
        if(this.infiniteTime <= 0 ){
            return;
        }
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
    },
    rePlayBgMusic:function(){
        shot.AudioHelper.rePlayMusic();
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
        this.userDataList = null;
        this.crazyTimePanel = null;
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
