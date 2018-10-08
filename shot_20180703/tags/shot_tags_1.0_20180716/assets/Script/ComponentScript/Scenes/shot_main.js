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
        bulletCountLabel : {
            default : null,
            type : cc.Label
        },
        infiniteBulletSprite : {
            default : null,
            type : cc.Sprite
        },

        infiniteBulletCountLabel : {
            default : null,
            type : cc.Label
        },

        infiniteBulletTimeNode : {
            default : null,
            type : cc.Node
        },
        infiniteBulletTimeSprite : {
            default : null,
            type : cc.Sprite
        },
        laserCountLabel : {
            default : null,
            type : cc.Label
        },

        //即将超越
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
        addScoreLabel : {
            default : null,
            type : cc.Label
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
        debugCount : 0,

        doubleHitAniAction0 : false,
        doubleHitAniAction1 : false,

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
        // this.openFireButton.node.on(cc.Node.EventType.TOUCH_START, this.openFireButtonTouchEnded, this, true);
        // this.openFireButton.node.on(cc.Node.EventType.TOUCH_MOVE, this.openFireButtonTouchMoved, this, true);
        // this.openFireButton.node.on(cc.Node.EventType.TOUCH_CANCEL, this.openFireButtonTouchCancel, this, true);
        this.openFireButton.node.on(cc.Node.EventType.TOUCH_END, this.openFireButtonTouchEnded, this, true);
        ty.NotificationCenter.listen(shot.EventType.GAME_START,this.gameStart, this);

        //TODO : test
        shot.GlobalFuncs.setBulletType("bulletType0");
        ty.NotificationCenter.listen(shot.EventType.REPLACE_GUN,this.replaceGunAction, this);

        //道具
        ty.NotificationCenter.listen(shot.EventType.UPDATE_INFINITEBULLET_NUMBER,this.updateInfiniteByllet, this);
        ty.NotificationCenter.listen(shot.EventType.UPDATE_LASERAIMING_NUMBER,this.updateLaserAiming, this);
        ty.NotificationCenter.listen(shot.EventType.RESURGENCE_RESULT,this.useToolResult, this);

        ty.NotificationCenter.listen(shot.EventType.REPLAY_BG_MUSIC,this.rePlayBgMusic, this);
        ty.NotificationCenter.listen(shot.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);

        this.updateInfiniteByllet();
        this.updateLaserAiming();

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

    replaceGunAction : function (index) {
        this.gunSprite.spriteFrame = this.gunSpriteList[index];
    },

    rePlayBgMusic:function(){
        shot.AudioHelper.rePlayMusic();
    },

    // 刷新无限子弹道具
    updateInfiniteByllet:function(){
        this.infiniteBulletCountLabel.string = "无限子弹 x" + hall.ME.udataInfo.infiniteBulletCount;
    },
    // 刷新激光瞄准道具
    updateLaserAiming:function(){
        this.laserCountLabel.string = "激光瞄准器 x" + hall.ME.udataInfo.laserAimingCount;
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
    //使用道具
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
            hall.MsgBoxManager.showToast({title : "当前关卡已使用激光瞄准器道具"});
            return;
        }
        if(this.laserSprite.node.active){
            hall.MsgBoxManager.showToast({title : "当前关卡已使用激光瞄准器道具"});
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
                shot.GameWorld.infiniteBulletTime ++;
            }else {
                this.laserSprite.node.active = true;
                this.laserCountLabel.string = "激光瞄准器 x" + hall.ME.udataInfo.laserAimingCount;
                shot.GameWorld.laserTime ++;
            }
        }else {
            hall.MsgBoxManager.showToast({title : "使用道具失败"});
        }
    },

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
            if(debugMode){
                shot.GameWorld.gameLevel = shot.GameWorld.initGameLevel;
                if(shot.GameWorld.initGameLevel > 1){
                    shot.GameWorld.bulletCount += 50;
                }
            }

            shot.GameWorld.bulletInfinite = true;
            this.bulletCountLabel.string = "";
            this.infiniteBulletSprite.node.active = true;
            shot.GameWorld.totalScore = 0;
            shot.GameWorld.bucketCount = 0;
            this.gameStartWithLevel();
            shot.GameWorld.resurgenceTime = 0;
            shot.GameWorld.addBulletTime = 0;
            this.addBulletButton.node.active = false;
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
        // //TODO
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
            //TODO:new
            this.bottomBucketWin.setBottlesWithListNew(onlyList);
            // this.bottomBucketWin.setBottlesWithList(onlyList);
            // hall.LOGW("=====","===level==="+level+"===bottleList==="+JSON.stringify(onlyList));
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
            // this.topBucketWin.setBottlesWithList(twoList.slice(0,12));
            // this.bottomBucketWin.setBottlesWithList(twoList.slice(12));
            //TODO:new
            this.topBucketWin.setBottlesWithListNew(twoList.slice(0,12));
            this.bottomBucketWin.setBottlesWithListNew(twoList.slice(12));
            // hall.LOGW("=====","===level==="+level+"===bottleList==="+JSON.stringify(twoList));
        }
    },
    openFireButtonTouchEnded : function(){
        if(shot.GameWorld.gameOver || shot.GameWorld.gamePause){
            return;
        }
        if(shot.GameWorld.bulletCount <= 0 && !shot.GameWorld.bulletInfinite){
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
        if(!shot.GameWorld.bulletInfinite){
            shot.GameWorld.bulletCount --;
            this.bulletCountLabel.string = shot.GameWorld.bulletCount+"";
            this.infiniteBulletSprite.node.active = false;
            if(shot.GameWorld.bulletCount <= 3){
                hall.GlobalFuncs.btnScaleEffectOnce(this.bulletCountLabel,1.7);
            }
        }

        //TODO:new
        this.bottomBucketWin.receiveBulletNew();
        this.topBucketWin.receiveBulletNew();

        // this.bottomBucketWin.receiveBullet();
        // this.topBucketWin.receiveBullet();
        this.gunNodeWin.openFire();
    },
    emptyGunAction : function () {
        this.emptyGunCount ++;
        if(this.emptyGunCount == shot.GameWorld.bucketCount){
            hall.LOGW("=====","======emptyGunAction======");
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
    bottleHit : function (lifeCount) {
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
            if(shot.GameWorld.bottleCount > 1 || (shot.GameWorld.bottleCount == 1 && lifeCount > 0)){
                this.gameOver();
            }
        }
    },
    playBottomDeadAnimation : function () {
        this.bottomBucketWin.playDeadAnimation();
    },
    levelUp : function () {
        var that = this;
        shot.GameWorld.gamePause = true;
        shot.GameWorld.bulletInfinite = false;
        if(shot.GameWorld.gameLevel != 1 && shot.GameWorld.gameLevel != 2){
            //增加剩余子弹的分数动画
            if(!shot.GameWorld.bulletInfinite){
                shot.GameWorld.totalScore += shot.GameWorld.bulletCount;
                this.getTheNextSurpassInfo();
                this.addScoreLabel.node.active = true;
                this.addScoreLabel.string = "+"+shot.GameWorld.bulletCount;
                var ani = this.infoAniNode.getComponent(cc.Animation);
                var clipName = ani.getClips()[0].name;
                var animation = ani.getAnimationState(clipName);
                animation.once("finished", function () {
                    that.nowScoreLabel.string = shot.GameWorld.totalScore;
                    that.addScoreLabel.node.active = false;
                });
                animation.play();
            }
        }

        // var level = shot.GameWorld.gameLevel + 1;
        //增加子弹
        if(shot.GameWorld.gameLevel == 1){
            shot.GameWorld.bulletInfinite = true;
            shot.GameWorld.bulletCount = 0;
            this.bulletCountLabel.string = "";
            this.infiniteBulletSprite.node.active = true;
            // shot.GameWorld.gameLevel ++;
            // that.gameStartWithLevel();
        }else if(shot.GameWorld.gameLevel == 2){
            shot.GameWorld.bulletCount = 0;
            this.setAddBulletButton();
        }
        shot.GameWorld.gameLevel ++;
        this.gameStartWithLevel();
    },
    gameOver : function () {
        hall.LOGW("=====","======gameOver======");
        shot.GameWorld.gameOver = true;
        shot.GameWorld.doubleHitCount = 0;
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

    update : function(dt) {
        if(shot.GameWorld.gameOver){
            if(this.gameOverCount > 0){
                this.gameOverCount -- ;
                if(this.gameOverCount == 0){
                    this.showGameOver();
                }
            }
            return;
        }
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
            this.infiniteBulletTimeSprite.fillRange = (this.infiniteTime/this.infiniteFullTime);
        }
    },
    // openFireButtonTouchBegan : function(){
    //
    // },
    // openFireButtonTouchMoved : function(){
    //
    // },
    // openFireButtonTouchCancel : function(){
    //
    // },
    onDebug : function () {
        this.debugCount ++;
        if(this.debugCount == 10){
            debugMode = true;
            shot.GlobalFuncs.showDebugPanel();
            this.debugCount = 0;
        }
    },
    onDestroy : function () {
        // this.doubleHitAniNode.removeAllChildren();
        // this.bulletAniNode.removeAllChildren();
        // this.infoAniNode.removeAllChildren();
        // this.levelAniNode.removeAllChildren();
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }
    // start () {
    //
    // },

});
