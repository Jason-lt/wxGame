(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/Scenes/double_main.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '08ba1q9sxVL7qGxdEnvXpYv', 'double_main', __filename);
// Script/ComponentScript/Scenes/double_main.js

'use strict';

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

        //标的物
        objectNode: {
            default: null,
            type: cc.Node
        },
        objectWin: {
            default: null,
            serializable: false
        },

        //枪
        leftGunNode: {
            default: null,
            type: cc.Node
        },
        leftGunWin: {
            default: null,
            serializable: false
        },
        rightGunNode: {
            default: null,
            type: cc.Node
        },
        rightGunWin: {
            default: null,
            serializable: false
        },
        leftGunButton: {
            default: null,
            type: cc.Button
        },
        rightGunButton: {
            default: null,
            type: cc.Button
        },

        //游戏失败
        gameFailNode: {
            default: null,
            type: cc.Node
        },

        //游戏进度/进度条
        progressNodeSprite: {
            default: null,
            type: cc.Sprite
        },
        objectBloodAll: 0,
        levelProgressSpriteList: [cc.Sprite],
        levelProgressSpriteFrameList: [cc.SpriteFrame],

        //关卡信息
        doubleInfoNode: {
            default: null,
            type: cc.Node
        },
        levelLabel: {
            default: null,
            type: cc.Label
        },
        scoreLabel: {
            default: null,
            type: cc.Label
        },

        //即将超越
        surpassNode: {
            default: null,
            type: cc.Node
        },
        surpassSprite: {
            default: null,
            type: cc.Sprite
        },
        surpassTexture: cc.Texture2D,
        surpassSpriteFrame: cc.SpriteFrame,
        surpassCount: 0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.rightGunWin = this.rightGunNode.getComponent('double_gun');
        this.rightGunWin.parentScene = this;
        this.leftGunWin = this.leftGunNode.getComponent('double_gun');
        this.leftGunWin.parentScene = this;
        this.objectWin = this.objectNode.getComponent('double_object');
        this.objectWin.parentScene = this;

        // this.leftGunButton.node.on(cc.Node.EventType.TOUCH_START, this.openFireLeftButtonTouchStart, this, true);
        this.leftGunButton.node.on(cc.Node.EventType.TOUCH_END, this.openFireLeftButtonTouchEnded, this, true);
        // this.rightGunButton.node.on(cc.Node.EventType.TOUCH_START, this.openFireRightButtonTouchStart, this, true);
        this.rightGunButton.node.on(cc.Node.EventType.TOUCH_END, this.openFireRightButtonTouchEnded, this, true);

        this.setSurpassNodeInit();

        //数据初始化
        double.GameWorld.totalLevel = hall.GlobalFuncs.ReadNumFromLocalStorage(double.gameModel.GAME_LEVEL, 1);
        double.GameWorld.newestObjectIndex = hall.GlobalFuncs.ReadNumFromLocalStorage(double.gameModel.GAME_NEWEST_OBJECT_INDEX, 3);
        double.GameWorld.chipNumber = hall.GlobalFuncs.ReadNumFromLocalStorage(double.gameModel.GAME_COIN_NUMBER, 0);
        double.GameWorld.totalScore = 0;

        var newer = hall.GlobalFuncs.ReadBoolFromLocalStorage(double.gameModel.IS_NEW_USER, true);
        if (newer) {
            this.newerGameStart();
        } else {
            this.gameStart();
        }
        ty.NotificationCenter.listen(double.EventType.GAME_START, this.gameStart, this);
        ty.NotificationCenter.listen(double.EventType.GAME_OVER, this.gameOverNoChange, this);

        hall.GlobalTimer.getCurWeek();

        // that.nowScoreLabel.string = shot.GameWorld.totalScore;
        // that.addScoreAniPool.put(aniNode);
        // aniNode.removeFromParent();
    },

    newerGameStart: function newerGameStart() {
        // //TODO:
        // this.doubleInfoNode.active = false;
        // this.objectNode.active = false;
        // double.GlobalFuncs.showTitlePage();

        double.GlobalFuncs.showNewResult();
    },

    gameStart: function gameStart(resurgence) {
        if (resurgence) {
            this.gameResurgence();
            return;
        }

        double.GameWorld.totalScore = 0;
        this.gameNextLevel();
    },
    gameNextLevel: function gameNextLevel() {
        //TODO:TEST
        double.GlobalFuncs.setDoubleGunType(1, "bow1");

        this.doubleInfoNode.active = true;
        this.objectNode.active = true;

        this.levelLabel.string = "第" + double.GameWorld.totalLevel + "关";
        this.scoreLabel.string = double.GameWorld.totalScore + "";
        double.GameWorld.levelObjectNumber = 5;
        this.chooseLevelObject();
        this.getNextObjectType();
        double.GameWorld.gameOver = false;
        double.GameWorld.gamePause = false;
    },
    gameResurgence: function gameResurgence() {
        this.objectWin.changeObjectType();
        double.GameWorld.gameOver = false;
        double.GameWorld.gamePause = false;
    },

    chooseLevelObject: function chooseLevelObject() {
        double.GameWorld.levelObjectList = [];
        var i;
        //配置物品
        if (double.GameWorld.newestObjectIndex <= 4) {
            for (i = 0; i < double.GameWorld.newestObjectIndex; i++) {
                double.GameWorld.levelObjectList.push("object" + i);
            }
            if (double.GameWorld.newestObjectIndex == 3) {
                if (double.GameWorld.totalLevel == 5) {
                    var tempN = hall.GlobalFuncs.getRandomNumberBefore(3) + 1;
                    double.GameWorld.levelObjectList.push(double.GameWorld.levelObjectList[tempN]);
                    double.GameWorld.levelObjectList[tempN] = "box";
                }
            } else if (double.GameWorld.newestObjectIndex == 2) {
                if (double.GameWorld.totalLevel == 2) {
                    double.GameWorld.levelObjectList.push("object" + hall.GlobalFuncs.getRandomNumberBefore(3));
                }
            }
        } else {
            var middleIndex = parseInt(double.GameWorld.newestObjectIndex - double.GameWorld.newestObjectIndex * double.GameWorld.generalConfig.objectStageTopScale);
            middleIndex = middleIndex < 2 ? 2 : middleIndex;
            var bottomIndex = parseInt(middleIndex - double.GameWorld.newestObjectIndex * double.GameWorld.generalConfig.objectStageMiddleScale);
            bottomIndex = bottomIndex < 1 ? 1 : bottomIndex;
            var tempNumber;
            var addNumber;
            var tempObject;
            while (double.GameWorld.levelObjectList.length < 5) {
                tempNumber = Math.random();
                if (tempNumber > 1 - double.GameWorld.generalConfig.objectStageTopProbability) {
                    addNumber = hall.GlobalFuncs.getRandomNumberBefore(double.GameWorld.newestObjectIndex - middleIndex + 1) + middleIndex;
                } else if (tempNumber > 1 - double.GameWorld.generalConfig.objectStageTopProbability - double.GameWorld.generalConfig.objectStageMiddleProbability) {
                    addNumber = hall.GlobalFuncs.getRandomNumberBefore(middleIndex - bottomIndex + 1) + bottomIndex;
                } else {
                    addNumber = hall.GlobalFuncs.getRandomNumberBefore(bottomIndex + 1);
                }
                tempObject = "object" + addNumber;
                if (double.GameWorld.levelObjectList.indexOf(tempObject) == -1) {
                    double.GameWorld.levelObjectList.push("object" + addNumber);
                }
            }
        }
        //添加宝箱
        var boxNowConfig;
        var subIndex;
        for (i = 0; i < double.GameWorld.boxConfig; i++) {
            boxNowConfig = double.GameWorld.boxConfig[i];
            if (boxNowConfig.minLevel <= double.GameWorld.totalLevel && boxNowConfig.maxLevel >= double.GameWorld.totalLevel) {
                if (boxNowConfig.minLevel == double.GameWorld.totalLevel) {
                    hall.GlobalFuncs.setInLocalStorage(double.gameModel.GAME_STAGE_BOX_NUMBER, 0);
                    if (Math.random() < boxNowConfig.probability) {
                        hall.GlobalFuncs.setInLocalStorage(double.gameModel.GAME_STAGE_BOX_NUMBER, 1);
                        subIndex = hall.GlobalFuncs.getRandomNumberBefore(4) + 1;
                        // double.GameWorld.levelObjectList[5] = double.GameWorld.levelObjectList[subIndex];
                        double.GameWorld.levelObjectList[subIndex] = "box";
                    }
                } else {
                    var nowNumber = hall.GlobalFuncs.ReadNumFromLocalStorage(double.gameModel.GAME_STAGE_BOX_NUMBER, 0);
                    if (nowNumber < boxNowConfig.mostBoxNumber) {
                        hall.GlobalFuncs.setInLocalStorage(double.gameModel.GAME_STAGE_BOX_NUMBER, nowNumber + 1);
                        subIndex = hall.GlobalFuncs.getRandomNumberBefore(4) + 1;
                        // double.GameWorld.levelObjectList[5] = double.GameWorld.levelObjectList[subIndex];
                        double.GameWorld.levelObjectList[subIndex] = "box";
                    }
                }
                break;
            }
        }

        // double.GameWorld.levelObjectList = ["object0","object1","object2","object3","object4"];
        double.GameWorld.levelObjectNumber = double.GameWorld.levelObjectList.length;

        for (i = 0; i < this.levelProgressSpriteList.length; i++) {
            this.levelProgressSpriteList[i].node.active = true;
            this.levelProgressSpriteList[i].spriteFrame = this.levelProgressSpriteFrameList[1];
            if (double.GameWorld.levelObjectList.length < 5 && i == 4) {
                this.levelProgressSpriteList[i].node.active = false;
            }
            if (double.GameWorld.levelObjectList.length < 4 && i == 3) {
                this.levelProgressSpriteList[i].node.active = false;
            }
        }
    },
    getNextObjectType: function getNextObjectType() {
        double.GameWorld.objectType = double.GameWorld.levelObjectList[double.GameWorld.levelObjectNumber - 1];

        var bloodList = double.GameWorld.objectConfig[double.GameWorld.objectType].bloodList;
        if (double.GameWorld.totalLevel >= 16) {
            double.GameWorld.objectBlood = hall.GlobalFuncs.getRandomNumberBefore(bloodList[1] - bloodList[0] + 1) + bloodList[0];
        } else if (double.GameWorld.totalLevel == 1) {
            double.GameWorld.objectBlood = bloodList[3];
        } else {
            double.GameWorld.objectBlood = hall.GlobalFuncs.getRandomNumberBefore(5) - 2 + parseInt(double.GameWorld.totalLevel / 15 * (bloodList[3] - bloodList[2]) + bloodList[2]);
        }

        this.objectBloodAll = double.GameWorld.objectBlood;
        this.progressNodeSprite.fillRange = 1;

        // double.GameWorld.objectAccelerated = double.GameWorld.objectConfig[double.GameWorld.objectType].accelerated;

        if (double.GameWorld.totalLevel <= double.GameWorld.generalConfig.stageOneLevel) {
            double.GameWorld.objectInitializedSpeed = double.GameWorld.objectConfig[double.GameWorld.objectType].initializedSpeed[0];
            double.GameWorld.objectAccelerated = double.GameWorld.objectConfig[double.GameWorld.objectType].accelerated[0];
        } else if (double.GameWorld.totalLevel <= double.GameWorld.generalConfig.stageTwoLevel) {
            double.GameWorld.objectInitializedSpeed = double.GameWorld.objectConfig[double.GameWorld.objectType].initializedSpeed[1];
            double.GameWorld.objectAccelerated = double.GameWorld.objectConfig[double.GameWorld.objectType].accelerated[1];
        } else {
            double.GameWorld.objectInitializedSpeed = double.GameWorld.objectConfig[double.GameWorld.objectType].initializedSpeed[2];
            double.GameWorld.objectAccelerated = double.GameWorld.objectConfig[double.GameWorld.objectType].accelerated[2];
        }

        this.objectWin.changeObjectType();
        double.GameWorld.gameLevelUp = false;
    },

    openFireLeftButtonTouchEnded: function openFireLeftButtonTouchEnded() {
        if (double.GameWorld.gameOver || double.GameWorld.gamePause || double.GameWorld.gameLevelUp) {
            return;
        }
        this.leftGunWin.sendArrow();
        this.objectWin.sendArrowForObject(0, this.leftGunWin.getGunAngle());
    },
    openFireRightButtonTouchEnded: function openFireRightButtonTouchEnded() {
        if (double.GameWorld.gameOver || double.GameWorld.gamePause || double.GameWorld.gameLevelUp) {
            return;
        }
        this.rightGunWin.sendArrow();
        this.objectWin.sendArrowForObject(1, this.rightGunWin.getGunAngle());
    },
    receiveArrow: function receiveArrow() {
        //增加分数
        double.GameWorld.totalScore += double.GameWorld.totalLevel;
        this.scoreLabel.string = double.GameWorld.totalScore + "";

        double.GameWorld.objectBlood -= double.GameWorld.gunDamageBonus;
        if (double.GameWorld.objectBlood <= 0) {
            this.objectWin.removeAllGunHitAniNodeChild();
            this.progressNodeSprite.fillRange = 0;
            double.GameWorld.levelObjectNumber--;
            double.GameWorld.gameLevelUp = true;
            this.objectWin.gameBomb();
        } else {
            this.progressNodeSprite.fillRange = double.GameWorld.objectBlood / this.objectBloodAll;
        }
    },
    afterObjectBomb: function afterObjectBomb() {
        this.levelNumberUp();
        // if(double.GameWorld.levelObjectNumber <= 0){
        //     // //本局游戏结束,按照关数出现界面
        //     // this.levelNumberUp();
        // }else {
        //     this.levelNumberUp();
        // }
    },
    levelNumberUp: function levelNumberUp() {
        this.objectWin.removeAllGunHitAniNodeChild();
        // double.GameWorld.levelObjectNumber --;
        this.levelProgressSpriteList[double.GameWorld.levelObjectNumber].spriteFrame = this.levelProgressSpriteFrameList[0];
        if (double.GameWorld.levelObjectNumber <= 0) {
            this.levelUp();
        } else {
            this.getNextObjectType();
        }
    },
    levelUp: function levelUp() {

        var nextNewLevel = 0;
        var addTemp = 2;
        while (nextNewLevel < double.GameWorld.totalLevel) {
            nextNewLevel += addTemp;
            if (nextNewLevel == double.GameWorld.totalLevel) {
                //TODO:解锁新物品
                double.GameWorld.newestObjectIndex++;
                hall.GlobalFuncs.setInLocalStorage(double.gameModel.GAME_NEWEST_OBJECT_INDEX, double.GameWorld.newestObjectIndex);
                break;
            }
            addTemp++;
        }

        double.GameWorld.totalLevel++;
        hall.GlobalFuncs.setInLocalStorage(double.gameModel.GAME_LEVEL, double.GameWorld.totalLevel);

        // // // //TODO:TEST
        // this.gameStart();
        //结果页面
        if (double.GameWorld.totalLevel % 10 == 1) {
            // 每10关，进行枪械转盘抽奖励
            double.GlobalFuncs.showRewardWeapon();
        } else {
            //闯关成功后展示闯关成功页面，字样向上滑动，出现老虎机
            double.GlobalFuncs.showNewResult();
        }
    },
    gameOver: function gameOver() {
        this.objectWin.removeAllGunHitAniNodeChild();
        double.GameWorld.gameOver = true;
        if (double.GameWorld.levelObjectNumber == 5) {
            double.GlobalFuncs.showGameOverResult();
        } else {
            double.GlobalFuncs.showResurgence();
        }
    },
    gameOverNoChange: function gameOverNoChange() {
        this.objectWin.removeAllGunHitAniNodeChild();
        double.GameWorld.gameOver = true;
        this.objectNode.active = false;
        this.doubleInfoNode.active = false;
    },
    gamePause: function gamePause() {
        double.GameWorld.gamePause = true;
        double.GlobalFuncs.showGamePause();
    },

    //超越好友
    setSurpassNodeInit: function setSurpassNodeInit() {
        var openDataContext = double.GlobalFuncs.getOpenData();
        if (!openDataContext) {
            return;
        }
        this.sharedCanvas = openDataContext.canvas;
        this.sharedCanvas.width = 300;
        this.sharedCanvas.height = 60;

        if (!this.surpassTexture) {
            this.surpassTexture = new cc.Texture2D();
        }
        if (!this.surpassSpriteFrame) {
            this.surpassSpriteFrame = new cc.SpriteFrame(this.surpassTexture);
        }
        this.surpassSprite.spriteFrame = this.surpassSpriteFrame;
    },
    setSurpassNode: function setSurpassNode() {
        this.surpassTexture.initWithElement(this.sharedCanvas);
        this.surpassTexture.handleLoadedTexture();
        this.surpassSprite.spriteFrame._refreshTexture(this.surpassTexture);
    },

    update: function update(dt) {
        this.surpassCount++;
        if (this.surpassCount >= 10) {
            this.surpassCount = 0;
            this.setSurpassNode();
        }
    },

    onDestroy: function onDestroy() {
        // this.arrowPool = null;
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=double_main.js.map
        