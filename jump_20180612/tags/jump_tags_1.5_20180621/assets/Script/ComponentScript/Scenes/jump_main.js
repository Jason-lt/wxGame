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
    ctor : function () {
        this.pedalPool = null;
    },

    properties: {
        roleNode : cc.Node,
        scoreLabel : cc.Label,
        scoreNode : {
            default : null,
            type : cc.Node
        },
        surpassNode : {
            default : null,
            type : cc.Node
        },
        surpassLabel : {
            default : null,
            type : cc.Label
        },

        pedalNode : {
            default : null,
            type : cc.Node
        },
        pedalPrefab : {
            default : null,
            type : cc.Prefab
        },
        // avatarPedal : {
        //     default : null,
        //     type : cc.Prefab
        // },

        caopingSprite : cc.Sprite,

        // toolList : [],

        pedalList : [cc.Prefab],
        pedalLargeTag : 1,

        windowHeight : 1136,
        windowWidth : 640,
        pedalRandomList : [],
        gapY : 80,
        topPedalHigh : 668,
        gameLevel : -1,
        speedConfig : null,
        previousPositionX : 0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad : function () {
        this.pedalPool = new cc.NodePool();
        if (!this.pedalPool){
            this.pedalPool = new cc.NodePool();
        }
        for (var i = 0; i <=  25; i++) {
            this.pedalPool.put(cc.instantiate(this.pedalPrefab)); // 通过 putInPool 接口放入对象池
        }
        wx.startAccelerometer({
            success: function() {
                hall.LOGW("==","===========success=========="+JSON.stringify(arguments));
            },
            fail: function() {
                hall.LOGW("==","===========fail=========="+JSON.stringify(arguments));
            },
            complete: function() {
            }
            }
        );
        wx.setKeepScreenOn({
            keepScreenOn : true,
            success: function() {
                hall.LOGW("==","===========success=========="+JSON.stringify(arguments));
            },
            fail: function() {
                hall.LOGW("==","===========fail=========="+JSON.stringify(arguments));
            },
            complete: function() {
            }
        });

        var winSize = cc.director.getWinSize();
        this.windowHeight = winSize.height;
        this.windowWidth = winSize.width;
        this.topPedalHigh = this.windowHeight/2 + 100* this.windowHeight/1136;
        var isNew = hall.GlobalFuncs.ReadBoolFromLocalStorage(jump.gameModel.GET_IS_NEW_USER,true);
        if(isNew){
            jump.gameModel.isGameOver = true;
            jump.GlobalFuncs.showNewTipsPanel();
        }else {
            this.resetMainGame("new");
        }
        // this.setScoreLevel();

        this.speedConfig = jump.gameModel.speedConfig || jump.Share.speedConfig;

        ty.NotificationCenter.listen(jump.EventType.REMOVE_PEDAL,this.removePedalWithTag,this);
        ty.NotificationCenter.listen(jump.EventType.GAME_OVER,this.gameOver ,this);
        ty.NotificationCenter.listen(jump.EventType.CHANGE_TOTAL_SCORE,this.setScoreLevel,this);
        ty.NotificationCenter.listen(jump.EventType.GAME_RESTART,this.gameReStart,this);
        ty.NotificationCenter.listen(jump.EventType.SURPASS_OTHERS,this.surpassOthers ,this);
        ty.NotificationCenter.listen(jump.EventType.SHOW_CAOPING_AFTER_GAMEOVER,this.showCaopingAfterGameOver,this);
        ty.NotificationCenter.listen(jump.EventType.SHOW_MYSCORE_AFTER_GAMEOVER,this.showMyScoreAfterGameOver,this);

    },
    onPauseAction : function () {
        jump.gameModel.isPause = true;
        jump.GlobalFuncs.showPausePanel();
    },
    changeHorizontalSpeed : function (event) {
        hall.LOGW("====","=======changeHorizontalSpeed=====");
        jump.gameModel.shouldGameOver = true;
    },
    showCaopingAfterGameOver : function () {
        this.caopingSprite.node.active = true;
    },
    showMyScoreAfterGameOver : function () {
        var resurgenceCount = jump.gameModel.resurgenceCount;
        if(resurgenceCount != 0){
            var resuegenceConfig = jump.gameModel.resurgenceConfig || jump.Share.resurgenceConfig;
            var goOnWindow = resuegenceConfig.goOnWindow;
            var resurgence ;
            if(ty.UserInfo.isInBSGS){
                resurgence = goOnWindow.bsgsUser;
            }else {
                resurgence = goOnWindow.noBsgsUser;
            }
            if(resurgence && resurgence.showType == 1){
                jump.GlobalFuncs.showResurgencePanel(resurgence);
            }else {
                jump.GlobalFuncs.showGameResultResurgence();
            }
        }else {
            jump.GlobalFuncs.showGameOverWithMyScore();
        }
    },
    surpassOthers : function (user) {
        this.surpassNode.active = true;
        if(user && user.nickname){
            this.surpassLabel.string = hall.GlobalFuncs.sliceStringToLength(user.nickname,10);
        }else {
            this.surpassLabel.string = "好友";
        }
        ty.Timer.setTimer(this,this.cancelSuepass,3);
    },
    cancelSuepass : function () {
        this.surpassNode.active = false;
    },
    resetMainGame : function (type) {
        hall.LOGW("===","=======resetMainGame=========");
        ty.TuyooSDK.wechatGetFriendDataDebug();
        jump.gameModel.isGameOver = false;
        jump.gameModel.shouldGameOver = false;
        this.scoreNode.active = true;
        jump.gameModel.isOnAnimation = false;
        this.cancelSuepass();
        if(type == "resurgence"){
            //TODO:复活时，人物置于活动区域最高点，居中，倒计时结束后缓速落下。
            jump.gameModel.resurgenceCount -= 1;
        }else {
            jump.gameModel.totalScore = 0;
            var speedCount = jump.gameModel.speedConfig || jump.Share.speedConfig;
            jump.gameModel.resurgenceCount = speedCount.resurgenceCount || 0;
        }
        this.gameLevel = -1;
        this.setScoreLevel();
        var that = this;
        if(type == "new"){
            requestAnimationFrame(function () {
                hall.LOGW("===","=======requestAnimationFrame=========");
                //初始布局
                var topHeight = that.topPedalHigh;
                var height = -topHeight ;
                while (height < topHeight){
                    that.addPedalAtHeight(height);
                    height += that.gapY;
                }
                that.caopingSprite.node.active = false;
            });
        }else {
            var topHeight = that.topPedalHigh;
            var height = -topHeight ;
            while (height < topHeight){
                that.addPedalAtHeight(height);
                height += that.gapY;
            }
            that.caopingSprite.node.active = false;
        }
    },
    gameOver : function(){
        jump.gameModel.pedalVerSpeed = 0;
        // jump.gameModel.isGameOver = true;
        this.scoreNode.active = false;
        jump.gameModel.nowPedalList = {};
        // jump.gameModel.movePedalHorizontalSpeed = 0;
        for (var i = 0 ; i < this.pedalList.length ; i ++){
            var pedal = this.pedalList[i];
            // pedal.removeFromParent();
            // pedal.destroy();
            this.removePedal(pedal);
        }
        this.pedalList = [];
        this.unscheduleAllCallbacks();
    },
    gameReStart : function (type) {
        this.resetMainGame(type);
        var com = this.roleNode.getComponent('jump_role');
        com.reStartGame();
    },
    setScoreLevel : function(){
        var score = jump.gameModel.totalScore;
        this.scoreLabel.string = score;
        // var pedalList = jump.gameModel.pedalList || jump.Share.pedalList;
        var pedalList = jump.gameModel.getPedalList();
        var nowGameLeval;
        var pedalComponent;
        for (var i = 0 ; i < pedalList.length ; i ++){
            var temp = pedalList[i];
            if(temp.minScore <= score && temp.maxScore > score){
                this.gapY = temp.gapY*this.windowHeight/1136;
                jump.gameModel.nowPedalList = temp;
                jump.gameModel.movePedalHorizontalSpeed = temp.movePedalHorizontalSpeed;
                nowGameLeval = temp.gameLevel;
                pedalComponent = temp.pedalComponent;
                break;
            }
        }
        if(this.gameLevel == nowGameLeval){
            return;
        }
        this.gameLevel = nowGameLeval;
        // if(this.gameLevel == jump.gameModel.nowPedalList.gameLevel){
        //     return;
        // }
        // this.gameLevel = jump.gameModel.nowPedalList.gameLevel;

        this.pedalRandomList = [];
        // var pedalComponent = jump.gameModel.nowPedalList.pedalComponent;
        for (var key in pedalComponent){
            var count = pedalComponent[key];
            for (var j = 0 ; j < count ; j ++){
                this.pedalRandomList.push(key);
            }
    }
    },
    removePedal : function (pedal) {
        var com = pedal.getComponent('jump_pedal');
        com.removeAni();
        var index = this.pedalList.indexOf(pedal);
        this.pedalList.slice(index,1);
        this.deletePedalWithPedal(pedal);
    },
    removePedalWithTag : function (pedalTag) {
        var pe = this.pedalNode.getChildByTag(pedalTag);
        var com = pe.getComponent('jump_pedal');
        com.removeAni();
        var index = this.pedalList.indexOf(pe);
        this.pedalList.slice(index,1);
        this.deletePedalWithPedal(pe);
    },
    deletePedalWithPedal : function (pedal) {
        if(pedal){
            this.pedalPool.put(pedal);
            pedal.removeFromParent();
        }
    },
    addPedalWithHeight : function (height,type) {
        var pedal;
        if (this.pedalPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            pedal = this.pedalPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            pedal = cc.instantiate(this.pedalPrefab);
        }

        this.pedalLargeTag ++;
        // var pedal = cc.instantiate(this.pedalPrefab);
        pedal.x = -this.windowWidth/2+jump.gameModel.pedalWidth/2+ hall.GlobalFuncs.getRandomNumberBefore(this.windowWidth-jump.gameModel.pedalWidth);
        if(type.indexOf("disable") == -1){
            this.previousPositionX = pedal.x;
        }else {
            var tempGapX = this.previousPositionX - pedal.x;
            while (tempGapX > -this.speedConfig.minDisablePedalGap && tempGapX < this.speedConfig.minDisablePedalGap){
                pedal.x = -this.windowWidth/2+jump.gameModel.pedalWidth/2+ hall.GlobalFuncs.getRandomNumberBefore(this.windowWidth-jump.gameModel.pedalWidth);
                tempGapX = this.previousPositionX - pedal.x;
            }
        }
        pedal.y = height;
        pedal.tag = this.pedalLargeTag;
        var com = pedal.getComponent('jump_pedal');
        com.setInformation(this.pedalLargeTag,type,height);
        this.pedalNode.addChild(pedal);
        this.pedalList.push(pedal);
    },
    addPedalAtHeight : function (height) {
        var type = this.pedalRandomList[hall.GlobalFuncs.getRandomNumberBefore(this.pedalRandomList.length)];
        if(type.indexOf("disable") > -1){
            var secondType = "disable";
            while (secondType.indexOf("disable") > -1 || secondType.indexOf("move") > -1){
                secondType = this.pedalRandomList[hall.GlobalFuncs.getRandomNumberBefore(this.pedalRandomList.length)];
            }
            this.addPedalWithHeight(height,secondType);
        }
        this.addPedalWithHeight(height,type);
    },
    update : function(dt) {
        // hall.LOGD("====update=====this.topHeight========"+this.topHeight);
        if(!this.pedalList || !this.pedalList.length || this.pedalList.length == 0){
            return;
        }
        if(jump.gameModel.isGameOver || jump.gameModel.isPause || jump.gameModel.shouldGameOver){
            return;
        }
        var com = this.pedalList[this.pedalList.length-1].getComponent('jump_pedal');
        var topHeight = com.getPedalY();
        if(topHeight + this.gapY < this.topPedalHigh-3){
            this.addPedalAtHeight(this.topPedalHigh);
        }

        var roleHeight = this.roleNode.y;
        var roleWidth = this.roleNode.x;
        var roleCom = this.roleNode.getComponent('jump_role');
        var effect = roleCom.runSpecialEffectsWithProperty();

        for (var i = 0 ; i < this.pedalList.length ; i ++){
            var tempPedal = this.pedalList[i];
            if(!tempPedal){
                continue;
            }
            var pedalCom = tempPedal.getComponent('jump_pedal');
            if(!pedalCom){
                continue;
            }
            var tempHeight = pedalCom.getDetectionYWithDirection(effect);
            var tempWidth = tempPedal.x;
            var gapWidth = tempWidth - roleWidth;
            var verticalDS = this.speedConfig.verticalDetectionSection;

            // var tempHeight = tempPedal.y;
            // var tempWidth = tempPedal.x;
            // var gapWidth = tempWidth - roleWidth;
            // var verticalDS = this.speedConfig.verticalDetectionSection;
            // var verticalEx = pedalCom.getDetectionYEXWithDirection(effect);
            // if(verticalEx != 0){
            //     tempHeight += 2*verticalEx/3;
            //     verticalDS += verticalEx/2;
            // }
            if(gapWidth <= this.speedConfig.horizontalDetectionSection &&
                gapWidth >= -this.speedConfig.horizontalDetectionSection &&
                tempHeight-verticalDS <= roleHeight &&
                tempHeight+verticalDS >= roleHeight){
                jump.gameModel.pedalGapWidth = gapWidth;
                if(effect == 1){
                    pedalCom.runSpecialEffectsWithProperty();
                    break;
                }else {
                    pedalCom.runUpSpecialEffectsWithProperty();//碰到怪物游戏结束
                }
            }else if(effect && roleHeight > tempHeight &&
                gapWidth <= this.speedConfig.horizontalDetectionSection &&
                gapWidth >= -this.speedConfig.horizontalDetectionSection ){
                var roleSpeed = roleCom.getVerticalSpeedNow();
                if(roleSpeed < - 500){
                    var nextY = roleCom.getNextNodeY();
                    if(tempHeight - nextY >= this.speedConfig.verticalDetectionSection){
                        roleCom.changePositionToY(tempHeight);
                        jump.gameModel.pedalGapWidth = gapWidth;
                        pedalCom.runSpecialEffectsWithProperty();
                        break;
                    }
                }
            }
        }
    },
    onDestroy:function(){
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }
});

wx.onAccelerometerChange(function (res) {
    ty.NotificationCenter.trigger(jump.EventType.CHANGE_ROLE_HORIZONTAL_SPEED,res.x);
    // hall.LOGW("==","===========onAccelerometerChange=========="+JSON.stringify(res));
});