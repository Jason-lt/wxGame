"use strict";
cc._RF.push(module, 'cfd20p3wbJPDYJsa+IK3R7O', 'shot_secret_box');
// Script/ComponentScript/window/shot_secret_box.js

"use strict";

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
        textRich: {
            default: null,
            type: cc.RichText
        },
        boxSprite: {
            default: null,
            type: cc.Sprite
        },
        boxSpriteFrameList: [cc.SpriteFrame],
        checkBoxButton: {
            default: null,
            type: cc.Button
        },
        checkBoxSprite: {
            default: null,
            type: cc.Sprite
        },
        // checkBoxSpriteFrameList : [cc.SpriteFrame],

        boxType: "",
        openType: "",
        parentScene: {
            default: null,
            serializable: false
        }
    },
    onLoad: function onLoad() {
        var openConfig;
        if (shot.gameModel.getAllCheckConfig()) {
            openConfig = shot.GameWorld.treasureConfig.showAtWindow.tishen;
        } else {
            if (ty.UserInfo.isInBSGS) {
                openConfig = shot.GameWorld.treasureConfig.showAtWindow.bsgs;
            } else {
                openConfig = shot.GameWorld.treasureConfig.showAtWindow.nBsgs;
            }
        }
        var openTypeList = openConfig.openType;

        var shareProbability = openConfig.shareProbability;
        this.checkBoxButton.node.active = false;
        this.chooseOpenTypeWithTypeListAndIndex(openTypeList, 0, shareProbability);

        ty.NotificationCenter.listen(shot.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
        ty.NotificationCenter.listen(shot.EventType.REWARD_VIDEO_COMPLETE, this.rewardVideoComplete, this);
        ty.NotificationCenter.listen(shot.EventType.REWARD_VIDEO_COMPLETE_ERROR, this.rewardVideoCompleteError, this);
    },

    chooseOpenTypeWithTypeListAndIndex: function chooseOpenTypeWithTypeListAndIndex(openTypeList, index, shareProbability) {
        if (index > 3) {
            return;
        }
        this.checkBoxButton.node.active = false;
        var type = openTypeList[index];
        switch (type) {
            case "ad":
                {
                    if (hall.adManager.canPlay) {
                        this.openType = "openAd";
                        this.textRich.string = "<color=#ffffff><b>看视频开启</b></color>";
                    } else {
                        this.chooseOpenTypeWithTypeListAndIndex(openTypeList, index + 1, shareProbability);
                    }
                    break;
                }
            case "share":
                {
                    var number = hall.GlobalFuncs.getRandomNumberBefore(100);
                    if (number < shareProbability) {
                        if (hall.GlobalFuncs.ReadNumFromLocalStorage(shot.gameModel.OPEN_BOX_CLOSE_STATE, 0)) {
                            this.chooseOpenTypeWithTypeListAndIndex(openTypeList, index + 1, shareProbability);
                        } else {
                            if (ty.UserInfo.isInBSGS) {
                                this.textRich.string = "<color=#ffffff><b>免费开启</b></color>";
                            } else {
                                this.textRich.string = "<color=#ffffff><b>炫耀一下并开启</b></color>";
                            }
                            this.openType = "openShare";
                        }
                    } else {
                        if (hall.adManager.canPlay) {
                            this.openType = "openAd";
                            this.textRich.string = "<color=#ffffff><b>看视频开启</b></color>";
                        } else {
                            this.chooseOpenTypeWithTypeListAndIndex(openTypeList, index + 1, shareProbability);
                        }
                    }
                    break;
                }
            case "checkbox":
                {
                    if (hall.GlobalFuncs.ReadNumFromLocalStorage(shot.gameModel.OPEN_BOX_CLOSE_STATE_CHECK, 0)) {
                        this.chooseOpenTypeWithTypeListAndIndex(openTypeList, index + 1, shareProbability);
                    } else {
                        this.textRich.string = "<color=#ffffff><b>开启</b></color>";
                        this.openType = "openShare";
                        this.checkBoxButton.node.active = true;
                    }
                    break;
                }
            case "direct":
                {
                    this.textRich.string = "<color=#ffffff><b>开启</b></color>";
                    this.openType = "open";
                    break;
                }
            default:
                break;
        }
    },
    setBoxTypeWithType: function setBoxTypeWithType(boxType, delegate) {
        this.boxType = boxType;
        this.parentScene = delegate;

        if (this.boxType == "treasureBox1") {
            this.checkBoxButton.node.active = false;
            this.textRich.string = "<color=#ffffff><b>开启</b></color>";
            this.openType = "open";
        }

        var spriteIndex = shot.GameWorld.bottleNameList.indexOf(this.boxType);
        this.boxSprite.spriteFrame = this.boxSpriteFrameList[spriteIndex - 4];
    },
    onCheckBoxChange: function onCheckBoxChange() {
        if (this.openType == "openShare") {
            this.textRich.string = "<color=#ffffff><b>开启</b></color>";
            this.openType = "open";
        } else {
            this.textRich.string = "<color=#ffffff><b>开启</b></color>";
            this.openType = "openShare";
        }
        this.checkBoxSprite.node.active = this.openType == "openShare";
    },
    onClose: function onClose() {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, ["closeBox", this.openType, this.boxType]);

        if (this.boxType == "treasureBox" && this.openType == "openShare") {
            var dayCount = hall.GlobalFuncs.ReadNumFromLocalStorage(shot.gameModel.OPEN_BOX_CLOSE_TIME, 0);
            hall.GlobalFuncs.setInLocalStorage(shot.gameModel.OPEN_BOX_CLOSE_TIME, dayCount + 1);
            if (dayCount + 1 >= shot.GameWorld.toolUserTimeConfig.closeBoxTime) {
                hall.GlobalFuncs.setInLocalStorage(shot.gameModel.OPEN_BOX_CLOSE_STATE, 1);
            }
        }

        if (shot.GameWorld.gameOver) {
            this.afterGameOver();
            return;
        }
        shot.GameWorld.gamePause = false;
        shot.GameWorld.gameGetBox = false;
        if (shot.GameWorld.bottleCount <= 0) {
            //一局的瓶子打完了
            this.parentScene.levelUp();
        }
        this.node.destroy();
    },

    onOpenBox: function onOpenBox() {
        // if(debugMode){
        //     this.changeStateToGet();
        //     return;
        // }
        if (this.boxType == "treasureBox" && this.openType == "openShare") {
            hall.GlobalFuncs.setInLocalStorage(shot.gameModel.OPEN_BOX_CLOSE_TIME, 0);
        }

        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, ["openBox", this.openType, this.boxType]);
        if (shot.GameWorld.gameOver) {
            this.afterGameOver();
            return;
        }
        switch (this.openType) {
            case "open":
                {
                    if (this.checkBoxButton.node.active) {
                        var dayCount = hall.GlobalFuncs.ReadNumFromLocalStorage(shot.gameModel.OPEN_BOX_CLOSE_TIME_CHECK, 0);
                        hall.GlobalFuncs.setInLocalStorage(shot.gameModel.OPEN_BOX_CLOSE_TIME_CHECK, dayCount + 1);
                        if (dayCount + 1 >= shot.GameWorld.toolUserTimeConfig.closeBoxTime) {
                            hall.GlobalFuncs.setInLocalStorage(shot.gameModel.OPEN_BOX_CLOSE_STATE_CHECK, 1);
                        }
                    }
                    this.changeStateToGet();
                }
                break;
            case "openShare":
                {
                    if (this.checkBoxButton.node.active) {
                        hall.GlobalFuncs.setInLocalStorage(shot.gameModel.OPEN_BOX_CLOSE_TIME_CHECK, 0);
                    }
                    if (ty.UserInfo.isInBSGS) {
                        shot.Share.shareWithType(shot.Share.onShareType.clickStatShareTypeOpenSecretBoxB);
                    } else {
                        shot.Share.shareWithType(shot.Share.onShareType.clickStatShareTypeOpenSecretBoxN);
                    }
                }
                break;
            case "openAd":
                {
                    hall.adManager.showRewardedVideo("openBox");
                }
                break;
            default:
                break;
        }
    },

    rewardVideoComplete: function rewardVideoComplete(isEnd) {
        if (hall.adManager.rewardedVideoType != "openBox") {
            return;
        }
        if (isEnd) {
            this.changeStateToGet();
        } else {
            hall.MsgBoxManager.showToast({ "title": "视频播放未完成" });
        }
    },

    rewardVideoCompleteError: function rewardVideoCompleteError(errorMsg) {
        if (hall.adManager.rewardedVideoType != "openBox") {
            return;
        }
        hall.MsgBoxManager.showToast({ "title": errorMsg });
        this.changeStateToGet();
    },

    afterGameOver: function afterGameOver() {
        shot.GameWorld.gameGetBox = false;
        hall.MsgBoxManager.showToast({ "title": "游戏已结束" });
        var isCheck = shot.gameModel.getAllCheckConfig();
        if (shot.GameWorld.resurgenceTime >= shot.GameWorld.toolUserTimeConfig.resurgenceTime || isCheck) {
            shot.GlobalFuncs.showGameOverWithMyScore();
        } else {
            shot.GlobalFuncs.showResurgence();
        }
        this.node.destroy();
    },

    playAnimationAfterShareWithType: function playAnimationAfterShareWithType(shareType) {

        if (shareType && (shareType == shot.Share.onShareType.clickStatShareTypeOpenSecretBoxB || shareType == shot.Share.onShareType.clickStatShareTypeOpenSecretBoxN)) {
            var resultType = shot.Share.resultType;
            switch (resultType) {
                case 1:
                    hall.MsgBoxManager.showToast({ title: '分享到群才有效哦~' });
                    break;
                case 2:
                    hall.MsgBoxManager.showToast({ title: '这个群今天已经打扰过了哦~' });
                    break;
                case 3:
                    this.changeStateToGet();
                    break;
                case 6:
                    hall.MsgBoxManager.showToast({ title: '分享失败' });
                    break;
                default:
                    hall.MsgBoxManager.showToast({ title: '分享失败了' });
                    break;
            }
        }
        shot.Share.resultType = 0;
    },

    changeStateToGet: function changeStateToGet() {
        var rewardConfig = shot.GameWorld.treasureConfig.rewardConfig[this.boxType];
        var rand = Math.random();
        var rewardType;
        var rewardIndex;
        var nowPercent = 0;
        var haveReward = false;
        for (var i = 0; i < shot.GameWorld.treasureBoxTypeList.length; i++) {
            rewardIndex = i;
            rewardType = shot.GameWorld.treasureBoxTypeList[i];
            nowPercent += rewardConfig[rewardType];
            if (rand <= nowPercent) {
                haveReward = true;
                break;
            }
        }
        if (!haveReward) {
            rewardIndex = hall.GlobalFuncs.getRandomNumberBefore(shot.GameWorld.treasureBoxTypeList.length);
            rewardType = shot.GameWorld.treasureBoxTypeList[rewardIndex];
        }

        if (rewardType == "laserGun") {
            shot.gameModel.shareToGetreward(10600002); //获得激光瞄准器
        } else if (rewardType == "infiniteBullet") {
            shot.gameModel.shareToGetreward(10600001); //获得无限子弹
        } else if (rewardType == "grenade") {
            shot.gameModel.shareToGetreward(10600005); //获得手榴弹
        } else {
            // shot.GlobalFuncs.playGetPropBoxAni(rewardIndex,shot.GameWorld.propertyConfig[rewardType].bulletType);
            shot.GlobalFuncs.playGetPropBoxAni(rewardIndex);
            shot.GlobalFuncs.setBulletType(shot.GameWorld.propertyConfig[rewardType].bulletType);
        }
        this.node.destroy();
    },

    onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }
    // LIFE-CYCLE CALLBACKS:

    // start () {
    //
    // },

    // update (dt) {},
});

cc._RF.pop();