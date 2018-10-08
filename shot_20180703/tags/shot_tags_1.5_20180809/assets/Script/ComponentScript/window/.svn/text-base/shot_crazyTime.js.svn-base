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
        titleSprite : {
          default : null,
            type : cc.Sprite
        },

        desNode : {
            default : null,
            type : cc.Node
        },

        countDownNode : {
            default : null,
            type : cc.Node
        },
        countDownSprite : {
            default : null,
            type : cc.Sprite
        },
        countDownSpriteFrameList : [cc.SpriteFrame],

        resultNode : {
            default : null,
            type : cc.Node
        },
        hitLabel : {
            default : null,
            type : cc.Label
        },
        lastLabel : {
            default : null,
            type : cc.Label
        },
        scoreLabel : {
            default : null,
            type : cc.Label
        },
        addScoreLabel : {
            default : null,
            type : cc.Label
        },

        isStartCrazyTimeAction : false,
        // titleCountDown : 120,
        countDown : 0,
        addScoreCountDown : 0,
        overCountDown : 0,

        afterResultCount : 0,

        titleNodeOpacity : 0,

        isAction : false,

        timeEnd : 0,

        parentScene: {
            default: null,
            serializable: false
        }
    },

    onLoad : function() {
        var ani = this.titleNode.getComponent(cc.Animation);
        var clipName = ani.getClips()[0].name;
        var animation = ani.getAnimationState(clipName);
        var that = this;
        animation.once("finished", function () {
            that.changeToDes();
        });
        animation.play();

        shot.GameWorld.crazyBottleCount.green = 0;
        shot.GameWorld.crazyBottleCount.purple = 0;
        shot.GameWorld.crazyBottleCount.orange = 0;
        shot.GameWorld.crazyBottleCount.red = 0;
        shot.GameWorld.crazyBottleHitCount = 0;
        shot.GameWorld.crazyBottleScore = 0;

    },

    changeToDes : function () {
        shot.AudioHelper.stopMusic();
        var isNew = hall.GlobalFuncs.ReadBoolFromLocalStorage(shot.gameModel.IS_NEW_CRAZY,true);
        this.titleNode.active = false;
        if(isNew){
            this.desNode.active = true;
        }else {
            this.startCrazyTimeFirst();
        }
    },

    startCrazyTimeFirst : function () {
        if(!this.isStartCrazyTimeAction){
            this.isStartCrazyTimeAction = true;
            this.parentScene.setCrazyTimeBucket();
        }
    },

    startCrazyTime : function () {
        hall.GlobalFuncs.setInLocalStorage(shot.gameModel.IS_NEW_CRAZY,false);
        shot.AudioHelper.playMusic(shot.EffectPath_mp3.musicCrazy,false);
        this.countDown = 180;
        hall.GlobalFuncs.btnScaleEffectOnce(this.countDownSprite,1.5);
        this.desNode.active = false;
        this.countDownNode.active = true;
        // this.parentScene.setCrazyTimeBucket();
    },

    countDownOut : function () {
        shot.GameWorld.gamePause = false;
        this.countDownNode.active = false;
        this.parentScene.startCrazyTime();
    },

    setCountDownEnd : function (time) {
        if(time <= 5 && time != 0 && this.timeEnd != time){
            this.timeEnd = time;
            this.countDownNode.active = true;
            this.countDownSprite.spriteFrame = this.countDownSpriteFrameList[time-1];
            hall.GlobalFuncs.btnScaleEffectOnce(this.countDownSprite,1.5);
        }
    },

    //结束
    crazyTimeOut : function () {
        shot.GameWorld.gamePause = true;
        this.countDownSprite.spriteFrame = this.countDownSpriteFrameList[6];
        this.crazyTimeEnd();
    },
    crazyTimeGood : function () {
        shot.AudioHelper.playEffect(shot.EffectPath_mp3.crazyCheer,false);
        shot.GameWorld.gamePause = true;
        this.countDownSprite.spriteFrame = this.countDownSpriteFrameList[5];
        this.crazyTimeEnd();
    },
    crazyTimeEnd : function () {
        this.countDownNode.active = true;
        this.addScoreCountDown = 60;
        for (var key in shot.GameWorld.crazyBottleCount){
            shot.GameWorld.crazyBottleHitCount += shot.GameWorld.crazyBottleCount[key];
            shot.GameWorld.crazyBottleScore += shot.GameWorld.crazyBottleCount[key]*shot.GameWorld.bottleConfig[key].crazyBottleScore;
        }
    },
    crazyTimeAddScoreFirst : function () {
        this.parentScene.removeCrazyWhenEnd();
    },
    crazyTimeAddScore : function () {
        this.resultNode.active = true;
        this.setResult();
    },
    setResult : function () {
        // this.hitLabel.string = shot.GameWorld.crazyBottleHitCount+"";
        this.hitLabel.string = shot.GameWorld.crazyBottleScore +"";

        this.lastLabel.string = ((shot.GameWorld.crazyBottleHitCount/(shot.GameWorld.crazyBottleHitCount+shot.GameWorld.bottleCount))*100 >> 0)+"%";

        if(shot.GameWorld.bottleCount == 0){
            this.scoreLabel.string = ((4*shot.GameWorld.crazyBonus/5) >> 0)+"";
        }else {
            this.scoreLabel.string = "0";
        }

        var ani = this.resultNode.getComponent(cc.Animation);
        var clipName = ani.getClips()[0].name;
        var animation = ani.getAnimationState(clipName);
        var that = this;
        animation.once("finished", function () {
            if(shot.GameWorld.bottleCount == 0){
                that.addScoreLabel.node.active = true;
                that.addScoreLabel.string = "+"+shot.GameWorld.crazyBottleScore;
                that.countDownSprite.node.active = false;
                that.overCountDown = 90;
                return;
                // that.scoreLabel.string = shot.GameWorld.crazyBonus+"";
            }
            that.afterResultCount = 90;
        });
        animation.play();
    },
    starCrazyTimeOverCountDown : function () {
        if(this.isAction){
            return;
        }
        shot.AudioHelper.playMusic(shot.EffectPath_mp3.musicGame,true);
        this.countDownNode.active = false;
        this.resultNode.active = false;
        this.parentScene.crazyTimeEndEnter();
    },
    crazyTimeOver : function () {
        this.parentScene.addCrazyTimeScore();
        this.parentScene.levelUp();
        this.node.destroy();
    },
    update :function(dt) {
        // if(!shot.GameWorld.gamePause){
        //     return;
        // }
        if(!shot.GameWorld.crazyMoment){
            return;
        }
        if(this.countDown){
            this.countDown --;
            if(this.countDown == 120){
                this.countDownSprite.spriteFrame = this.countDownSpriteFrameList[1];
                hall.GlobalFuncs.btnScaleEffectOnce(this.countDownSprite,1.5);
            }else if(this.countDown == 60){
                this.countDownSprite.spriteFrame = this.countDownSpriteFrameList[0];
                hall.GlobalFuncs.btnScaleEffectOnce(this.countDownSprite,1.5);
            }else if(this.countDown == 0){
                this.countDownOut();
            }
            return;
        }
        if(this.addScoreCountDown){
            this.addScoreCountDown --;
            if(this.addScoreCountDown == 0){
                this.crazyTimeAddScoreFirst();
            }
            return;
        }
        if(this.overCountDown){
            this.overCountDown --;
            this.addScoreLabel.string = ((shot.GameWorld.crazyBottleScore+(90-this.overCountDown)*shot.GameWorld.crazyBonus/90) >> 0)+"";
            if(this.overCountDown == 0){
                shot.GameWorld.crazyBottleScore += shot.GameWorld.crazyBonus;
                this.addScoreLabel.string = shot.GameWorld.crazyBottleScore+"";
                this.afterResultCount = 90;
                // this.isAction = false;
            }
        }
        if(this.afterResultCount){
            this.afterResultCount --;
            if(this.afterResultCount == 0){
                this.isAction = false;
                this.starCrazyTimeOverCountDown();
            }
        }
    },
    // LIFE-CYCLE CALLBACKS:


    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }
    // start () {
    //
    // },


});
