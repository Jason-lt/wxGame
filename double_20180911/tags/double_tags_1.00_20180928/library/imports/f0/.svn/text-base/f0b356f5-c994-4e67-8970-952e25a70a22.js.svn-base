"use strict";
cc._RF.push(module, 'f0b35b1yZROZ4lwlS4lpwoi', 'double_rewardWeapon');
// Script/ComponentScript/window/double_rewardWeapon.js

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
        levelLabel: {
            default: null,
            type: cc.Label
        },
        btnTitleLabel: {
            default: null,
            type: cc.Label
        },
        rollNode: {
            default: null,
            type: cc.Node
        },
        resultIndex: 0,
        isStartAni: false,
        isEndAni: false
    },
    // LIFE-CYCLE CALLBACKS:

    blackAction: function blackAction() {},
    backAction: function backAction() {},
    onLoad: function onLoad() {
        ty.NotificationCenter.listen(double.EventType.GAME_ROLL_STOP, this.stopAnimation, this);
    },

    updateRewardInfo: function updateRewardInfo() {
        this.levelLabel.string = "第" + (double.GameWorld.totalLevel - 1) + "关";
        //TODO: 计算武器抽取结果
        this.resultIndex = 5;
        this.rollNode.getComponent("double_cell_newResult").setRollTypeAndScale(double.windowNewWeaponType.newWeapon, 10, this.resultIndex);
        this.rollNode.getComponent("double_cell_newResult").setRollTime(200, 10);
    },
    startAnimation: function startAnimation() {
        if (!this.isStartAni) {
            this.isStartAni = true;
            this.rollNode.getComponent("double_cell_newResult").setRollTypeAndScale(double.windowNewWeaponType.newWeapon, 10, 10);
            this.rollNode.getComponent("double_cell_newResult").setRollTime(100, 300);
        } else {
            if (this.isEndAni) {
                //TODO:退出页面
                this.node.destroy();
            }
        }
    },
    stopAnimation: function stopAnimation(aniType) {
        if (aniType != double.windowNewWeaponType.newWeapon) {
            return;
        }
        if (this.isStartAni) {
            this.startAnimation();
            return;
        }
        this.isEndAni = true;
        //TODO:选中动画
        this.btnTitleLabel.string = "OK";
    },
    onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }

    // update (dt) {},
});

cc._RF.pop();