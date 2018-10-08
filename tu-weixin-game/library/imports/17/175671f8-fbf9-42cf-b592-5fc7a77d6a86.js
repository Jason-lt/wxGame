"use strict";
cc._RF.push(module, '17567H4+/lCz7WSX8enfWqG', 'ddz_new_reward');
// Script/ComponentScript/window/ddz_new_reward.js

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
        redBagLabel: cc.Label,
        backBtn: cc.Node,
        tips: cc.Label
    },

    onLoad: function onLoad() {
        var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        if (backButtonH) {
            this.backBtn.y = backButtonH;
        }
    },
    // state == 1 新人红包;  state == 2 回归红包
    setBagState: function setBagState(state) {
        if (state == 1) {
            this.redBagLabel.string = "新人红包";
        } else {
            this.redBagLabel.string = "回归红包";
            this.tips.active = false;
        }
    },

    //拆红包
    onOpenRedBag: function onOpenRedBag() {
        ddz.matchModel.startMatchProgress();
        ddz.gameModel.isOpenRedBag = true;
        this.onClose();
    },

    onClose: function onClose() {
        this.node.destroy();
        ddz.newReward = null;
    }

    // update (dt) {},
});

cc._RF.pop();