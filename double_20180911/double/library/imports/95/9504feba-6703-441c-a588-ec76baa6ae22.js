"use strict";
cc._RF.push(module, '9504f66ZwNEHKWI7Ha6pq4i', 'double_newResult');
// Script/ComponentScript/window/double_newResult.js

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

        titleLabel: {
            default: null,
            type: cc.Label
        },

        addNode: {
            default: null,
            type: cc.Node
        },
        addNumberLabel: {
            default: null,
            type: cc.Label
        },

        coinNumber: 0,
        coinLabel: {
            default: null,
            type: cc.RichText
        },

        bgSprite: {
            default: null,
            type: cc.Sprite
        },
        bgSpriteFrameList: [cc.SpriteFrame],

        rollNode1: {
            default: null,
            type: cc.Node
        },
        rollNode2: {
            default: null,
            type: cc.Node
        },
        rollNode3: {
            default: null,
            type: cc.Node
        },

        topButton: {
            default: null,
            type: cc.Button
        },
        topBtnTitleLabel: {
            default: null,
            type: cc.Label
        },
        bottomButton: {
            default: null,
            type: cc.Button
        },
        bottomBtnTitle: {
            default: null,
            type: cc.Label
        },

        isStartAni: false,
        isEndAni: false,

        resultIndex1: 0,
        resultIndex2: 0,
        resultIndex3: 0,
        resultNumber: 0
    },

    blackAction: function blackAction() {},
    backAction: function backAction() {},
    onLoad: function onLoad() {
        ty.NotificationCenter.listen(double.EventType.GAME_ROLL_STOP, this.endRollAnimation, this);
        ty.NotificationCenter.listen(double.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
    },
    updateNewResultInfo: function updateNewResultInfo() {
        this.titleLabel.string = "第" + (double.GameWorld.totalLevel - 1) + "关";
        this.bgSprite.spriteFrame = this.bgSpriteFrameList[0];
        this.coinNumber = 0;
        this.addNode.active = false;
        this.isStartAni = false;
        this.isEndAni = false;
        this.resultNumber = 0;
        this.topButton.node.active = false;
        this.bottomBtnTitle.string = "赚金币";
        //TODO:计算结果
        this.resultIndex1 = hall.GlobalFuncs.getRandomNumberBefore(double.GameWorld.newestObjectIndex + 1);
        this.resultIndex2 = 0;
        this.resultIndex3 = 0;
        this.rollNode1.getComponent("double_cell_newResult").setRollTypeAndScale(double.windowNewWeaponType.newResultRollOne, double.GameWorld.newestObjectIndex, this.resultIndex1);
        this.rollNode2.getComponent("double_cell_newResult").setRollTypeAndScale(double.windowNewWeaponType.newResultRollTwo, double.GameWorld.newestObjectIndex, this.resultIndex2);
        this.rollNode3.getComponent("double_cell_newResult").setRollTypeAndScale(double.windowNewWeaponType.newResultRollThree, double.GameWorld.newestObjectIndex, this.resultIndex3);
        this.rollNode1.getComponent("double_cell_newResult").setRollTime(10, 55);
        this.rollNode2.getComponent("double_cell_newResult").setRollTime(10, 50);
        this.rollNode3.getComponent("double_cell_newResult").setRollTime(10, 45);
    },
    startRollAnimation: function startRollAnimation() {
        this.isStartAni = true;
        this.rollNode1.getComponent("double_cell_newResult").setRollTime(10, 120);
        this.rollNode2.getComponent("double_cell_newResult").setRollTime(10, 100);
        this.rollNode3.getComponent("double_cell_newResult").setRollTime(10, 115);
    },
    endRollAnimation: function endRollAnimation(rollType) {
        if (rollType < double.windowNewWeaponType.newResultRollOne) {
            return;
        }
        if (!this.isStartAni) {
            this.isStartAni = true;
            this.rollNode1.getComponent("double_cell_newResult").setRollTime(20, 330);
            this.rollNode2.getComponent("double_cell_newResult").setRollTime(20, 350);
            this.rollNode3.getComponent("double_cell_newResult").setRollTime(20, 370);
            return;
        }
        if (rollType == double.windowNewWeaponType.newResultRollOne) {
            this.coinNumber += double.GameWorld.objectConfig[double.GameWorld.doubleObjectList[this.resultIndex1]].goldNumber;
            // this.coinNumber += this.resultIndex1;
        } else if (rollType == double.windowNewWeaponType.newResultRollTwo) {
            this.coinNumber += double.GameWorld.objectConfig[double.GameWorld.doubleObjectList[this.resultIndex2]].goldNumber;
            // this.coinNumber += this.resultIndex2;
        } else {
            this.coinNumber += double.GameWorld.objectConfig[double.GameWorld.doubleObjectList[this.resultIndex3]].goldNumber;
            // this.coinNumber += this.resultIndex3;
        }
        this.coinLabel.string = "<color=#000000>获得 </c><img src='double_titlePage_coin'/><color=#000000> " + this.coinNumber + "0</color>";
        this.resultNumber++;
        if (this.resultNumber >= 3) {
            //TODO:计算翻倍结果
            this.isEndAni = true;
            var resultAdd = 1;
            if (this.resultIndex1 == this.resultIndex2 && this.resultIndex2 == this.resultIndex3) {
                resultAdd = 3;
            } else if (this.resultIndex1 == this.resultIndex2 || this.resultIndex2 == this.resultIndex3) {
                resultAdd = 2;
            }
            if (resultAdd != 1) {
                this.addNode.active = true;
                this.addNumberLabel.string = resultAdd + "倍";
            }
            this.coinNumber *= resultAdd;
            this.coinLabel.string = "<color=#000000>获得 </c><img src='double_titlePage_coin'/><color=#000000> " + this.coinNumber + "0</color>";

            this.bgSprite.spriteFrame = this.bgSpriteFrameList[1];
        }
    },

    getMoreCoinAction: function getMoreCoinAction() {
        double.Share.shareWithType(double.Share.onShareType.clickStatShareTypeAddBullet);
    },
    playAnimationAfterShareWithType: function playAnimationAfterShareWithType(shareType) {
        if (shareType && shareType == double.Share.onShareType.clickStatShareTypeOpenSecretBoxB) {
            var resultType = double.Share.resultType;
            switch (resultType) {
                case 1:
                    hall.MsgBoxManager.showToast({ title: '分享到群才有效哦~' });
                    break;
                case 2:
                    hall.MsgBoxManager.showToast({ title: '这个群今天已经打扰过了哦~' });
                    break;
                case 3:
                    this.coinNumber *= 2;
                    this.getCoinAction();
                    break;
                case 6:
                    hall.MsgBoxManager.showToast({ title: '分享失败' });
                    break;
                default:
                    hall.MsgBoxManager.showToast({ title: '分享失败了' });
                    break;
            }
        }
        double.Share.resultType = 0;
    },

    getCoinAction: function getCoinAction() {
        //TODO:领取金币
        double.GameWorld.chipNumber += this.coinNumber;
        hall.GlobalFuncs.setInLocalStorage(double.gameModel.GAME_COIN_NUMBER, double.GameWorld.chipNumber);

        this.node.removeFromParent();
    },

    onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {
    //
    // },

    // update (dt) {},
});

cc._RF.pop();